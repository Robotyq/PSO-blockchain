const Sphere = artifacts.require("SphereFunction");
const Rosenbrock = artifacts.require("RosenbrockFunction");
const Rastrigin = artifacts.require("RastriginFunction");

module.exports = async function (deployer, network, accounts) {
    // Deploy the Sphere function contract
    await deployer.deploy(Sphere, { overwrite: true });
    const sphere = await Sphere.deployed();
    console.log('Sphere Function deployed at address:', sphere.address);

    // Deploy the Rosenbrock function contract
    await deployer.deploy(Rosenbrock, { overwrite: true });
    const rosenbrock = await Rosenbrock.deployed();
    console.log('Rosenbrock Function deployed at address:', rosenbrock.address);

    // Deploy the Rastrigin function contract
    await deployer.deploy(Rastrigin, { overwrite: true });
    const rastrigin = await Rastrigin.deployed();
    console.log('Rastrigin Function deployed at address:', rastrigin.address);
};
