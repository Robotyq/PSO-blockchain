const Particle = artifacts.require("Particle");
const Controller = artifacts.require("Controller");

module.exports = async function (deployer, network, accounts) {
    try {
        // Retrieve the deployed Controller contract instance
        const controller = await Controller.deployed();
        console.log('Using Controller at address:', controller.address);

        // Retrieve the number of particles managed by the controller
        const particleCount = 10;
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
        const totalIterations = 100;
        let currentIteration = 0;

        // Function to perform iterations for a single particle within the same block
        const performParticleIterations = async (particle, iterations) => {
            const owner = await particle.methods.getOwner().call();
            const iterationPromises = [];

            for (let i = 0; i < iterations; i++) {
                iterationPromises.push(
                    particle.methods.iterate().send({ from: owner, gas: 300000 })
                );
            }

            // Wait for all 10 iterations to complete within the same block
            await Promise.all(iterationPromises);
            currentIteration += iterations;

            console.log(`Completed ${iterations} iterations for particle at ${particle._address}`);
        };

        // Function to perform iterations sequentially across all particles
        const performIterationsSequentially = async () => {
            for (let i = 0; i < particles.length; i++) {
                const particle = particles[i];
                console.log(`Starting iterations for Particle ${i + 1} at address: ${particle._address}`);

                // Perform 10 iterations for the current particle within the same block
                await performParticleIterations(particle, 10);

                // Check if total iterations limit is reached
                if (currentIteration >= totalIterations) {
                    console.log('Reached total iteration limit. Stopping.');
                    break;
                }
            }

            console.log('All iterations complete.');
        };

        // Start performing iterations
        await performIterationsSequentially();

    } catch (error) {
        console.error('Error during iterations:', error);
        throw error; // Re-throw the error to ensure Truffle recognizes the migration failed
    }
};
``
