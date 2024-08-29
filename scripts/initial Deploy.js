const Sphere = artifacts.require("SphereFunction");
const Rosenbrock = artifacts.require("RosenbrockFunction");
const Rastrigin = artifacts.require("RastriginFunction");
const Controller = artifacts.require("Controller");
const Particle = artifacts.require("Particle");

module.exports = async function (deployer, network, accounts) {
    // Ensure we are using the first account from Ganache
    const account = accounts[0];

    // Deploy the Sphere function contract
    await deployer.deploy(Sphere, { from: account, overwrite: true });
    const sphere = await Sphere.deployed();
    console.log('Sphere Function deployed at address:', sphere.address);

    // Deploy the Rosenbrock function contract
    await deployer.deploy(Rosenbrock, { from: account, overwrite: true });
    const rosenbrock = await Rosenbrock.deployed();
    console.log('Rosenbrock Function deployed at address:', rosenbrock.address);

    // Deploy the Rastrigin function contract
    await deployer.deploy(Rastrigin, { from: account, overwrite: true });
    const rastrigin = await Rastrigin.deployed();
    console.log('Rastrigin Function deployed at address:', rastrigin.address);

    // Deploy the Controller contract, configured to optimize the Sphere function
    await deployer.deploy(Controller, sphere.address, { from: account, value: web3.utils.toWei('1', 'ether'), overwrite: true });
    const controller = await Controller.deployed();
    console.log('Controller deployed at address:', controller.address);

    // Define initial positions and speeds for the particles
    const initialPositions = [
        [100, 150],
        [200, 250],
        [300, 350],
        [400, 450],
        [500, 550]
    ];
    const initialSpeeds = [
        [10, 15],
        [20, 25],
        [30, 35],
        [40, 45],
        [50, 55]
    ];

    // Deploy 5 Particle contracts attached to the Controller
    let particles = [];
    for (let i = 0; i < 5; i++) {
        const particle = await deployer.deploy(Particle, controller.address, initialPositions[i], initialSpeeds[i], { from: account, overwrite: true });
        particles.push(particle);
        console.log(`Particle ${i + 1} deployed at address: ${particle.address}`);
    }

    // Perform a single iteration for each particle
    console.log('Performing a single iteration for each particle...');
    for (let particle of particles) {
        await particle.iterate({ from: account });
        console.log(`Particle at address ${particle.address} has iterated.`);
    }

    console.log('Deployment and iteration complete.');
};
