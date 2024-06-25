import ControllerContract from '../contracts/Controller.js';
import ParticleContract from '../contracts/Particle.js';

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
            if (position[2] > 10000000000000)
                position = position.map(pos => pos / 1000000000000000000);
            let localBest = await Promise.all([
                particleInstance.methods.localBest(0).call(),
                particleInstance.methods.localBest(1).call(),
                particleInstance.methods.localBest(2).call(),
            ]);
            localBest = localBest.map(pos => Number(pos));
            if (localBest[2] > 10000000000000)
                localBest = localBest.map(pos => pos / 1000000000000000000);
            const owner = await particleInstance.methods.getOwner().call();
            return {address, position, localBest, owner};
        })
    );
};

export const fetchEventsData = async (web3, controller, currentBlock) => {
    const fromBlock = Math.max(currentBlock - 5, 0);
    // console.log('Current block number:', currentBlock)
    // console.log('Fetching events of ', controller, 'from block', fromBlock, 'to latest')
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
                };
            case 'NewBestGlobal':
                return {
                    event: 'NewBestGlobal',
                    blockNumber: event.blockNumber,
                    particle: event.returnValues.particle,
                    newValue: event.returnValues.newVar
                };
            case 'TargetFunctionUpdated':
                return {
                    event: 'TargetFunctionUpdated',
                    blockNumber: event.blockNumber,
                    targetFunctionAddress: event.returnValues.newTargetFunction
                };
            default:
                return {
                    event: 'UnknownEvent',
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

    return [...formattedGlobalVarEvents, ...particleEvents.map(event => {
            switch (event.event) {
                case 'NewLocalMin':
                    return {
                        event: 'New Local Min',
                        blockNumber: event.blockNumber,
                        particle: event.returnValues.particle,
                        newPos: event.returnValues.newVal
                    };
                default:
                    return {
                        event: 'UnknownEvent',
                        blockNumber: event.blockNumber,
                        data: event
                    };
            }
        }
    )];
}

export const iterate = async (account, controller, value, callback) => {
    try {
        console.log('Iterating with value:', value, "from account:", account);
        const send = controller.methods.iterateTimes(value).send({from: account});
        send.then((receipt) => {
            console.log('Transaction receipt:', receipt);
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
        topics: [web3.utils.sha3('FunctionContractDeployed(address)')]
    });
    return events.map(event => ({
        address: event.address
    }));
};

export const updateTargetFunction = async (account, controller, newTargetFunction) => {
    try {
        const send = controller.methods.updateTargetFunction(newTargetFunction).send({from: account});
        await send;
        console.log('Target function updated successfully.');
    } catch (error) {
        console.error('Error updating target function:', error);
        throw error;
    }
};

export const fetchGlobalMin = async (controller) => {
    console.log('Fetching global min from controller:', controller)
    const min = [];
    for (let i = 0; i < 3; i++) {
        const pos = await controller.methods.bestPoint(i).call();
        let number = Number(pos);
        if (number > 10000000000)
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
        const send = particleInstance.methods.iterate(value).send({from: account});
        send.then((receipt) => {
            console.log('Transaction receipt:', receipt)
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
        arguments: [controller.options.address, position, speed]
    }).send({from: account});

    // Get the address of the newly deployed Particle contract
    const newParticleAddress = newParticleInstance.options.address;

    // await controller.methods.addParticle(newParticleAddress).send({ from: account });

    console.log(`New Particle deployed at address: ${newParticleAddress}`);
};

export const getTargetFunction = async (controller) => {
    return await controller.methods.targetFunctionAddress().call();
};