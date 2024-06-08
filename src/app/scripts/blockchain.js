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
            const position = await Promise.all([
                particleInstance.methods.position(0).call(),
                particleInstance.methods.position(1).call(),
            ]);
            return {address, position};
        })
    );
};

export const fetchEventsData = async (web3, controller) => {
    let currentBlockNumber = await web3.eth.getBlockNumber();
    currentBlockNumber = Number(currentBlockNumber);
    const fromBlock = Math.max(currentBlockNumber - 5, 0);
    console.log('Current block number:', currentBlockNumber)
    console.log('Fetching events of ', controller, 'from block', fromBlock, 'to latest')
    const controllerEvents = await controller.getPastEvents('allEvents', {
        fromBlock,
        toBlock: 'latest',
    });
    const formattedGlobalVarEvents = controllerEvents.map(event => {
        switch (event.event) {
            case 'UpdateVar':
                return {
                    event: 'UpdateVar',
                    particle: event.returnValues.particle,
                    oldBestPos: event.returnValues.old.bestPos,
                    oldMinValue: event.returnValues.old.minValue,
                    newBestPos: event.returnValues.newVar.bestPos,
                    newMinValue: event.returnValues.newVar.minValue
                };
            case 'ParticleBorn':
                return {
                    event: 'ParticleBorn',
                    particle: event.returnValues.particle,
                    initialPosition: event.returnValues.position,
                    speed: event.returnValues.speed
                };
            case 'NewBestGlobal':
                return {
                    event: 'NewBestGlobal',
                    particle: event.returnValues.particle,
                    oldValue: event.returnValues.old,
                    newValue: event.returnValues.newVar
                };
            default:
                return {
                    event: 'UnknownEvent',
                    data: event
                };
        }
    });

    console.log('Fetched events', formattedGlobalVarEvents)
    return formattedGlobalVarEvents;
};

export const iterate = async (web3, account, controller, value, callback) => {
    try {
        console.log('Iterating with value:', value, "from account:", account);
        const send = controller.methods.iterateAll().send({from: account});
        send.then((receipt) => {
            console.log('Transaction receipt:', receipt);
            callback();
        });
    } catch (error) {
        console.error('Error iterating:', error);
        throw error;
    }
};

