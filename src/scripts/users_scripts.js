import ParticleContract from '../contracts/Particle.js';

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
