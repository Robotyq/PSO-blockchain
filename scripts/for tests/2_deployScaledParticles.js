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

    // Deploy the Controller contract with RastriginFunction as the target function
    await deployer.deploy(Controller, rastrigin.address, {
        from: owners[0],
        value: web3.utils.toWei('1', 'ether'),
        overwrite: true,
    });
    const controller = await Controller.deployed();
    console.log('Controller deployed at address:', controller.address);

    // Scaling factor for positions (10^18)
    const scalingFactor = web3.utils.toBN(10).pow(web3.utils.toBN(18));

    // Deploy 10 Particle contracts with random initial positions scaled by 10^18 and zero initial speed
    for (let i = 0; i < 10; i++) {
        const owner = owners[i % owners.length];
        const rawPosition = [
            Math.floor(Math.random() * 10001) - 5000, // Random position between -5000 and 5000 for x
            Math.floor(Math.random() * 10001) - 5000, // Random position between -5000 and 5000 for y
        ];

        // Scale positions by 10^18
        const initialPosition = [
            web3.utils.toBN(rawPosition[0]).mul(scalingFactor).toString(),
            web3.utils.toBN(rawPosition[1]).mul(scalingFactor).toString()
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
            `Particle ${i + 1} deployed at address: ${particle.address} with initial position ${initialPosition} by owner: ${owner}`
        );
    }

    console.log('Deployment of Controller and Particles complete.');
};
