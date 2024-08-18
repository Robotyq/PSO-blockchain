import ParticleContract from '../contracts/Particle.js';
import ControllerContract from '../contracts/Controller.js';
import TargetFunctionContract from '../contracts/TargetFunction.js';

export const fetchUserParticlesByEvents = async (web3, account) => {
    const eventSignature = web3.utils.sha3('ParticleAdded(address,address,address)');
    console.log("Event Signature:", eventSignature);
    // Fetch logs for the ParticleAdded event
    const particleEvents = await web3.eth.getPastLogs({
        fromBlock: 0,
        toBlock: 'latest',
        topics: [eventSignature],
    });
    console.log("particleEvents: ", particleEvents)
    const particles = [];

    for (const event of particleEvents) {
        const decodedLog = web3.eth.abi.decodeLog(
            [
                {type: 'address', name: 'particle'},
                {type: 'address', name: 'particleOwner'},
                {type: 'address', name: 'controllerAddress'},
            ],
            event.data,
            event.topics.slice(1)
        );

        const {particle, particleOwner, controllerAddress} = decodedLog;

        // Only proceed if the particleOwner matches the current account
        if (particleOwner.toLowerCase() === account.toLowerCase()) {
            const particleInstance = new web3.eth.Contract(ParticleContract.abi, particle);

            const position = await Promise.all([
                particleInstance.methods.position(0).call(),
                particleInstance.methods.position(1).call(),
                particleInstance.methods.currentValue().call()
            ]);

            const localBest = await Promise.all([
                particleInstance.methods.localBest(0).call(),
                particleInstance.methods.localBest(1).call(),
                particleInstance.methods.localBest(2).call(),
            ]);

            const targetFunction = await particleInstance.methods.targetFunction().call();
            particles.push({
                address: particle,
                position: position.map(Number),
                localBest: localBest.map(Number),
                owner: particleOwner,
                controller: controllerAddress,
                targetFunction: targetFunction,
            });
        }
    }

    return particles;
};


export const fetchAllControllerDetails = async (web3, fromBlock = 0) => {
    // Get the deployed network information
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = ControllerContract.networks[networkId];
    if (!deployedNetwork) {
        throw new Error('Controller contract not deployed on this network');
    }

    // Fetch all past logs related to the Controller contract deployment
    const controllerDeploymentEvents = await web3.eth.getPastLogs({
        fromBlock,
        toBlock: 'latest',
        topics: [web3.utils.sha3('ControllerDeployed(address)')] // Correct event signature
    });

    const controllers = [];
    console.log("controllerDeploymentEvents: ", controllerDeploymentEvents)

    // Loop through each event to get the controller address and fetch its details
    for (const event of controllerDeploymentEvents) {
        const controllerAddress = web3.eth.abi.decodeParameter('address', event.data);
        const controllerInstance = new web3.eth.Contract(ControllerContract.abi, controllerAddress);

        const targetFunctionAddress = await controllerInstance.methods.targetFunctionAddress().call();
        const targetFunctionInstance = new web3.eth.Contract(TargetFunctionContract.abi, targetFunctionAddress);

        const functionName = await targetFunctionInstance.methods.name().call();
        const globalMin = await Promise.all([
            controllerInstance.methods.bestPoint(0).call(),
            controllerInstance.methods.bestPoint(1).call(),
            controllerInstance.methods.bestPoint(2).call(),
        ]);

        const particlesCount = await controllerInstance.methods.getParticlesCount().call();
        const controllerOwner = await controllerInstance.methods.owner().call();

        controllers.push({
            address: controllerAddress,
            targetFunctionAddress,
            functionName,
            particlesCount: Number(particlesCount),
            globalMin: globalMin.map(Number),
            owner: controllerOwner
        });
    }
    console.log("controllers: ", controllers)
    return controllers;
};

export const initializeControllerFromAddress = async (web3, adr) => {
    return new web3.eth.Contract(ControllerContract.abi, adr);
}


