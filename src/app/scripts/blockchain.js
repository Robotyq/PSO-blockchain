import ControllerContract from '../contracts/Controller.json';
import ParticleContract from '../contracts/Particle.json';

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
    console.log('Fetching events from block', fromBlock, 'to latest')
    return await controller.getPastEvents('allEvents', {
        fromBlock,
        toBlock: 'latest',
    });
};
