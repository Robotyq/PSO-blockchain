import ControllerContract from '../contracts/Controller.js';
import ParticleContract from '../contracts/Particle.js';
import IFunction from "@/contracts/TargetFunction";

export const initializeController = async (web3) => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = ControllerContract.networks[networkId];
    if (!deployedNetwork) {
        throw new Error('Controller contract not deployed on this network');
    }
    return new web3.eth.Contract(
        ControllerContract.abi,
        deployedNetwork && deployedNetwork.address
    );
};
export const fetchParticlesData = async (web3, controller) => {
    const particleCount = await controller.methods.getParticlesCount().call();
    const particlePromises = [];
    for (let i = 0; i < particleCount; i++) {
        particlePromises.push(controller.methods.particles(i).call());
    }
    const particleAddresses = await Promise.all(particlePromises);
    return await Promise.all(
        particleAddresses.map(async (address) => {
            const particleInstance = new web3.eth.Contract(ParticleContract.abi, address);
            let position = await Promise.all([
                particleInstance.methods.position(0).call(),
                particleInstance.methods.position(1).call(),
                particleInstance.methods.currentValue().call()
            ]);
            position = position.map(pos => Number(pos));
            console.log('Position:', position);
            if (Math.abs(position[1]) > 10000000000000 && Math.abs(position[0]) > 10000000000000)
                position = position.map(pos => pos / 1000000000000000000);
            let localBest = await Promise.all([
                particleInstance.methods.localBest(0).call(),
                particleInstance.methods.localBest(1).call(),
                particleInstance.methods.localBest(2).call(),
            ]);
            localBest = localBest.map(pos => Number(pos));
            if (Math.abs(localBest[0]) > 10000000000000 && Math.abs(localBest[1]) > 10000000000000)
                localBest = localBest.map(pos => pos / 1000000000000000000);
            const owner = await particleInstance.methods.getOwner().call();

            let speed = await Promise.all([
                particleInstance.methods.speed(0).call(),
                particleInstance.methods.speed(1).call(),
            ]);
            speed = speed.map(pos => Number(pos));
            if (Math.abs(speed[0]) > 10000000000000 && Math.abs(speed[1]) > 10000000000000)
                speed = speed.map(pos => pos / 1000000000000000000);
            return {address, position, localBest, owner, speed};
        })
    );
};

export const fetchEventsData = async (web3, controller, fromBlock) => {
    const controllerEvents = await controller.getPastEvents('allEvents', {
        fromBlock,
        toBlock: 'latest',
    });
    const formattedGlobalVarEvents = controllerEvents.map(event => {
        switch (event.event) {
            case 'ParticleAdded':
                return {
                    event: 'ParticleAdded',
                    blockNumber: event.blockNumber,
                    particle: event.returnValues.particle,
                    logIndex: event.logIndex,
                };
            case 'NewBestGlobal':
                return {
                    event: 'NewBestGlobal',
                    blockNumber: event.blockNumber,
                    particle: event.returnValues.particle,
                    newValue: event.returnValues.newVar,
                    logIndex: event.logIndex,
                };
            case 'TargetFunctionUpdated':
                return {
                    event: 'TargetFunctionUpdated',
                    blockNumber: event.blockNumber,
                    logIndex: event.logIndex,
                    targetFunctionAddress: event.returnValues.newTargetFunction
                };
            case 'ControllerDeployed':
                return {
                    event: 'ControllerDeployed',
                    blockNumber: event.blockNumber,
                    logIndex: event.logIndex,
                    thisContractAddress: event.returnValues.thisContractAddress
                }
            default:
                return {
                    event: 'UnknownEvent',
                    logIndex: event.logIndex,
                    blockNumber: event.blockNumber,
                    data: event
                };
        }
    });
    // console.log('Fetched events', formattedGlobalVarEvents)

    // Fetch particle addresses from the Controller contract
    const particleCount = await controller.methods.getParticlesCount().call();
    const particleEvents = [];

    for (let i = 0; i < particleCount; i++) {
        const particleAddress = await controller.methods.particles(i).call();
        const particleInstance = new web3.eth.Contract(ParticleContract.abi, particleAddress);
        const events = await particleInstance.getPastEvents('allEvents', {
            fromBlock,
            toBlock: 'latest',
        });
        particleEvents.push(...events)
        // console.log('Fetched events for particle', particleAddress, events);
    }

    const allEvents = [...formattedGlobalVarEvents, ...particleEvents.map(event => {
            switch (event.event) {
                case 'NewLocalMin':
                    return {
                        event: 'New Local Min',
                        blockNumber: event.blockNumber,
                        logIndex: event.logIndex,
                        particle: event.returnValues.particle,
                        newPos: event.returnValues.newVal
                    };
                case 'Moved':
                    return {
                        event: 'Moved',
                        blockNumber: event.blockNumber,
                        logIndex: event.logIndex,
                        particle: event.returnValues.particle,
                        newValue: event.returnValues.newValue,
                        transactionHash: event.transactionHash
                    };
                default:
                    return {
                        event: 'UnknownEvent',
                        logIndex: event.logIndex,
                        blockNumber: event.blockNumber,
                        data: event
                    };
            }
        }
    )];
    allEvents.sort((a, b) => {
        const aEventIndex = Number(a.blockNumber) * 1000 + Number(a.logIndex);
        const bEventIndex = Number(b.blockNumber) * 1000 + Number(b.logIndex);
        return aEventIndex - bEventIndex;
    });
    return allEvents;
}

export const iterate = async (account, controller, value, callback) => {
    try {
        console.log('Iterating with value:', value, "from account:", account);
        const send = controller.methods.iterateTimes(value).send({
            from: account,
            // gasLimit: 10000000000
        });
        send.then((receipt) => {
            // console.log('Transaction receipt:', receipt);
            callback();
        });
    } catch (error) {
        console.error('Error iterating:', error);
        throw error;
    }
};

export const fetchDeployedFunctions = async (web3) => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = ControllerContract.networks[networkId];
    if (!deployedNetwork) {
        throw new Error('ControllerContract not deployed on this network');
    }
    const events = await web3.eth.getPastLogs({
        fromBlock: 0,
        toBlock: 'latest',
        topics: [web3.utils.sha3('FunctionContractDeployed(address,string)')]
    });
    // console.log('Fetched events for deployed Functions:', events)
    return events.map(event => {
        const decodedData = web3.eth.abi.decodeParameters(['address', 'string'], event.data);
        return {
            address: event.address,
            name: decodedData[1]
        };
    });
};

export const updateTargetFunction = async (account, controller, newTargetFunction) => {
    try {
        const send = controller.methods.updateTargetFunction(newTargetFunction).send({from: account});
        await send;
        // console.log('Target function updated successfully.');
    } catch (error) {
        console.error('Error updating target function:', error);
        throw error;
    }
};

export const fetchGlobalMin = async (controller) => {
    // console.log('Fetching global min from controller:', controller)
    const min = [];
    for (let i = 0; i < 3; i++) {
        const pos = await controller.methods.bestPoint(i).call();
        // console.log('pos:', pos)
        let number = Number(pos);
        if (Math.abs(number) > 10000000000)
            number /= 1000000000000000000;
        min.push(number);
    }
    // const min= await controller.methods.bestPoint(2).call();
    // const events = await controller.me('NewBestGlobal', {
    //     fromBlock: 0,
    //     toBlock: 'latest',
    // });
    // if (events.length === 0) {
    //     throw new Error('No NewBestGlobal events found');
    // return [0, 0, NaN]
    // }
    // const latestEvent = events[events.length - 1];
    return min
    // return latestEvent.returnValues.newVar;
};

export const iterateParticle = async (web3, account, particleAddress, value, callback) => {
    const particleInstance = new web3.eth.Contract(ParticleContract.abi, particleAddress);
    try {
        console.log('Iterating particle with value:', value, "from account:", account);
        const send = particleInstance.methods.iterateTimes(value).send({
            from: account,
            // gasLimit: 10000000000
        });
        send.then((receipt) => {
            // console.log('Transaction receipt:', receipt)
            callback();
        });
        send.catch((error) => {
            console.error('Error iterating particle in promise:', error);
            callback();
            // throw error;
        });
    } catch (error) {
        console.error('Error iterating particle:', error);
        throw error;
    }
};

export const deployParticle = async (web3, account, controller, initialPosition, initialSpeed) => {
    const position = [initialPosition.x, initialPosition.y];
    const speed = [initialSpeed.vx, initialSpeed.vy];
    // Get the contract instance for Particle
    const newParticleContract = new web3.eth.Contract(ParticleContract.abi);
    // Deploy a new Particle contract
    const newParticleInstance = await newParticleContract.deploy({
        data: ParticleContract.bytecode,
        arguments: [controller, position, speed]
    }).send({from: account});
    console.log('Deploying new Particle contract with position:', position, 'speed:', speed, 'controller:', controller, 'from account:', account)

    // Get the address of the newly deployed Particle contract
    const newParticleAddress = newParticleInstance.options.address;

    // await controller.methods.addParticle(newParticleAddress).send({ from: account });

    console.log(`New Particle deployed at address: ${newParticleAddress}`);
};

export const getTargetFunction = async (web3, controller) => {
    let functionAddress = await controller.methods.targetFunctionAddress().call();
    console.log('Fetched target function:', functionAddress)
    const name = await getFunctionName(web3, functionAddress);
    functionAddress = functionAddress.toString().toLowerCase();
    const lastThree = functionAddress.slice(-3);
    const firstThree = functionAddress.slice(0, 4);
    const targetFunctionName = (name || "Unnamed F") + " " + firstThree + "..." + lastThree;
    console.log('Fetched target function:', targetFunctionName, 'at address:', functionAddress)
    return {
        address: functionAddress,
        name: name,
        printName: targetFunctionName
    };
};

export const deployController = async (web3, account, targetFunctionAddress) => {
    try {
        const newControllerContract = new web3.eth.Contract(ControllerContract.abi);

        // Deploy a new Controller contract
        const newControllerInstance = await newControllerContract.deploy({
            data: ControllerContract.bytecode,
            arguments: [targetFunctionAddress] // Pass the target function address to the constructor
        }).send({from: account});
        // console.log('Deploying new Controller contract with target function:', targetFunctionAddress, 'from account:', account)
        // Get the address of the newly deployed Controller contract
        const newControllerAddress = newControllerInstance.options.address;

        // console.log(`New Controller deployed at address: ${newControllerAddress}`);
        return newControllerAddress;
    } catch (error) {
        console.error('Error deploying controller:', error);
        throw error;
    }
};

export const getFunctionName = async (web3, targetFunctionAddress) => {
    try {
        const contract = new web3.eth.Contract(IFunction.abi, targetFunctionAddress);
        return await contract.methods.name().call();
    } catch (error) {
        console.error('Error fetching function name:', error);
        return "Unnamed Function";
    }
}
