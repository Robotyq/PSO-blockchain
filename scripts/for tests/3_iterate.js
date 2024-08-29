const Particle = artifacts.require("Particle");
const Controller = artifacts.require("Controller");

module.exports = async function (deployer, network, accounts) {
    try {
        // Retrieve the deployed Controller contract instance
        const controller = await Controller.deployed();
        console.log('Using Controller at address:', controller.address);

        // Retrieve the number of particles managed by the controller
        const particleCount = 50;
        const particles = [];

        // Retrieve the addresses and instances of all particles
        for (let i = 0; i < particleCount; i++) {
            const particleAddress = await controller.particles(i); // Correct way to call contract method in Truffle
            const particleInstance = new web3.eth.Contract(
                Particle.abi,
                particleAddress
            );
            particles.push(particleInstance);
            console.log(`Found Particle ${i + 1} at address: ${particleAddress}`);
        }

        // Set the total number of iterations to perform
        const totalIterations = 15;
        let currentIteration = 0;

        // Function to perform a random number of iterations per block
        const performIterations = async () => {
            while (currentIteration < totalIterations) {
                // Randomize number of iterations per block between 5 and 10
                const iterationsPerBlock = Math.floor(Math.random() * 10) + 5;
                const iterationPromises = [];
                console.log(`Performing ${iterationsPerBlock} iterations in this block...`);
                for (let i = 0; i < iterationsPerBlock; i++) {
                    // Select a random particle for this iteration
                    const particleIndex = Math.floor(Math.random() * particles.length);
                    const particle = particles[particleIndex];
                    const owner = await particle.methods.getOwner().call();

                    // Explicitly set a gas limit
                    iterationPromises.push(
                        particle.methods.iterate().send({ from: owner, gas: 300000 })
                    );
                    currentIteration++;

                    if (currentIteration >= totalIterations) {
                        break;
                    }
                }
                // Wait for all iterations in this block to complete
                await Promise.all(iterationPromises);
                console.log(`Completed ${iterationsPerBlock} iterations for this block.`);
            }

            console.log('All iterations complete.');
        };

        // Start performing iterations
        await performIterations();

    } catch (error) {
        console.error('Error during iterations:', error);
        throw error; // Re-throw the error to ensure Truffle recognizes the migration failed
    }
};
