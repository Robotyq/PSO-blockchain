const Particle = artifacts.require("Particle");
const Controller = artifacts.require("Controller");
const Sphere = artifacts.require("SphereFunction");
const Rosenbrock = artifacts.require("RosenbrockFunction");
const Rastrigin = artifacts.require("RastriginFunction");
module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(Sphere);
    const sphere = await Sphere.deployed();
    await deployer.deploy(Controller, sphere.address, {'value': web3.utils.toWei('10', 'ether')});
    const controller = await Controller.deployed();

    // Deploy the first Particle contract with the address of controller
    const part1 = await deployer.deploy(Particle, controller.address, [152,150], [20,25], {overwrite: true});
    // nu mai trebe, se face in constructorul particulei // await controller.addParticle(part1.address);
    console.log('Particle 1 deployed at address: ' + part1.address)
    // Deploy the second Particle contract with the same address of controller
    const part2 = await deployer.deploy(Particle, controller.address, [132,130], [30,23], {overwrite: true});
    console.log('Particle 2 deployed at address: ' + part2.address)
    // Deploy the third Particle from another account
    const part3 = await deployer.deploy(Particle, controller.address, [120,125], [15,20], {overwrite: true, from: "0x1246Ba0c3C25CbB3cD210Ae69f7946aC57DE56F0" });

    console.log("Deploying the other functions...");
    const rosenbrock = await deployer.deploy(Rosenbrock);
    const rastrigin = await deployer.deploy(Rastrigin);
    console.log("Deployed the other functions.");
    console.log("Changing the target function to Rastrigin...");
    await controller.updateTargetFunction(rosenbrock.address);
    await controller.updateTargetFunction(rastrigin.address);

    console.log('making the particles iterate for the first time...');
    await controller.iterateTimes(1);
};
