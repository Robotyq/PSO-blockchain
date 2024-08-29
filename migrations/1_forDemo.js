const Particle = artifacts.require("Particle");
const Controller = artifacts.require("Controller");
const Sphere = artifacts.require("SphereFunction");
const Rosenbrock = artifacts.require("RosenbrockFunction");
const Rastrigin = artifacts.require("RastriginFunction");

function getRandomPosition() {
    return Math.floor(Math.random() * 2001) - 1000; // Random number between -1000 and +1000
}

function getRandomChunkSize() {
    return Math.floor(Math.random() * 3) + 1; // Random number between 1 and 3
}

module.exports = async function (deployer, network, accounts) {
    // Deploy SphereFunction and Controller using SphereFunction
    await deployer.deploy(Sphere, { overwrite: true });
    const sphere = await Sphere.deployed();
    await deployer.deploy(Controller, sphere.address, { value: web3.utils.toWei('1', 'ether') });
    const sphereController = await Controller.deployed();

    // Deploy RastriginFunction and Controller using RastriginFunction
    await deployer.deploy(Rastrigin, { overwrite: true });
    const rastrigin = await Rastrigin.deployed();
    await deployer.deploy(Controller, rastrigin.address, { value: web3.utils.toWei('1', 'ether') });
    const rastriginController = await Controller.deployed();

    // Deploy RosenbrockFunction and Controller using RosenbrockFunction
    await deployer.deploy(Rosenbrock, { overwrite: true });
    const rosenbrock = await Rosenbrock.deployed();
    await deployer.deploy(Controller, rosenbrock.address, { value: web3.utils.toWei('1', 'ether') });
    const rosenbrockController = await Controller.deployed();

    // List of controllers to iterate over
    const controllers = [
        { controller: sphereController, scale: 1 },
        { controller: rastriginController, scale: 1e17 },
        { controller: rosenbrockController, scale: 1 }
    ];

    // Deploy Particle contracts using accounts dynamically for each controller
    const particlesData = [
        { accountIndex: 0 },
        { accountIndex: 0 },
        { accountIndex: 1 },
        { accountIndex: 1 },
        { accountIndex: 1 },
        { accountIndex: 2 },
        { accountIndex: 2 },
        { accountIndex: 3 },
        { accountIndex: 3 },
        { accountIndex: 4 }
    ];

    for (const { controller, scale } of controllers) {
        for (const data of particlesData) {
            const initialPosition = [
                getRandomPosition() * scale,
                getRandomPosition() * scale
            ];
            const initialSpeed = [0, 0]; // Initial speed set to zero

            const particle = await deployer.deploy(Particle, controller.address, initialPosition, initialSpeed, {
                overwrite: true,
                from: accounts[data.accountIndex]
            });
            console.log(`Particle deployed at address: ${particle.address} for controller: ${controller.address} from account: ${accounts[data.accountIndex]}`);
            data.particleInstance = new web3.eth.Contract(Particle.abi, particle.address);
        }

        let totalIterations = 0;
        const iterationCounts = Array(particlesData.length).fill(0);

        while (totalIterations < 100) {
            const chunkSize = getRandomChunkSize();
            let promises = [];

            for (let j = 0; j < chunkSize; j++) {
                const particleIndex = totalIterations % particlesData.length;
                if (iterationCounts[particleIndex] < 10) {
                    const account = accounts[particlesData[particleIndex].accountIndex];
                    const particleInstance = particlesData[particleIndex].particleInstance;
                    promises.push(particleInstance.methods.iterate().send({ from: account }));
                    iterationCounts[particleIndex]++;
                    totalIterations++;
                }
            }

            console.log(`Processing chunk with ${promises.length} iterations...`);
            await Promise.all(promises);
        }
    }

    console.log("All controllers and particles deployed with intercalated iterations and random chunk sizes.");
};
