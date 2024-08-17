import ParticleContract from '../contracts/Particle.js';

// Function to fetch all particles owned by the user by listening to ParticleAdded events
export const fetchUserParticlesByEvents = async (web3, account, fromBlock = 0) => {
    const particleEvents = await web3.eth.getPastLogs({
        fromBlock,
        toBlock: 'latest',
        topics: [web3.utils.sha3('ParticleAdded(address,address,address)')],
    });

    const particles = [];

    for (const event of particleEvents) {
        const {particleAddress, controllerAddress} = web3.eth.abi.decodeLog(
            [
                {type: 'address', name: 'particle'},
                {type: 'address', name: 'particleAddress'},
                {type: 'address', name: 'controllerAddress'},
            ],
            event.data,
            event.topics.slice(1)
        );

        const particleInstance = new web3.eth.Contract(ParticleContract.abi, particleAddress);
        const owner = await particleInstance.methods.getOwner().call();

        if (owner.toLowerCase() === account.toLowerCase()) {
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

            particles.push({
                address: particleAddress,
                position: position.map(Number),
                localBest: localBest.map(Number),
                owner,
                controller: controllerAddress,
            });
        }
    }

    return particles;
};
