const Controller = artifacts.require("Controller");
const Particle = artifacts.require("Particle");
const Sphere = artifacts.require("SphereFunction");
const Rastrigin = artifacts.require("RastriginFunction");
const Rosenbrock = artifacts.require("RosenbrockFunction");

module.exports = async function (deployer, network, accounts) {
    // Assuming the first 4 accounts from Ganache will be used as owners
    const owners = [accounts[0], accounts[1], accounts[2], accounts[3]];

    const sphere = await Sphere.deployed();
    const rastrigin = await Rastrigin.deployed();
    const rosenbrock = await Rosenbrock.deployed();

    // Deploy the Controller contract with SphereFunction as the target function
    await deployer.deploy(Controller, sphere.address, {
        from: owners[0],
        value: web3.utils.toWei('1', 'ether'),
        overwrite: true,
    });
    const controller = await Controller.deployed();
    console.log('Controller deployed at address:', controller.address);

    // Deploy 10 Particle contracts with random initial positions and zero initial speed
    const nrParticles = 10;
    for (let i = 0; i < nrParticles; i++) {
        const owner = owners[i % owners.length];
        const initialPosition = [
            Math.floor(Math.random() * 10001) - 5000, // Random position between -5000 and 5000 for x
            Math.floor(Math.random() * 10001) - 5000, // Random position between -5000 and 5000 for y
        ];
        const initialSpeed = [0, 0]; // Initial speed set to zero
        const particle = await deployer.deploy(
            Particle,
            controller.address,
            initialPosition,
            initialSpeed,
            { from: owner, overwrite: true }
        );
        console.log(
            `Particle ${i + 1} deployed at address: ${particle.address} by owner: ${owner}`
        );
    }

    console.log('Deployment of Controller and Particles complete.');
};
