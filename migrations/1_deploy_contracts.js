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

    // Deploy the first Particle contract with the address of controller and sphere
    const part1 = await deployer.deploy(Particle, controller.address, sphere.address, [152*10^16,150*10^16], [20,25], {overwrite: true});
    // await controller.addParticle(part1.address);
    console.log('Particle 1 deployed at address: ' + part1.address)
    // Deploy the second Particle contract with the same address of controller and sphere
    // const part2 = await deployer.deploy(Particle, controller.address, sphere.address, [132,130], [30,23], {overwrite: true, from: "0xa3b4108AB9BFE9ABA90e7d43c4b2bA0232DEeBB7" });
    // await controller.addParticle(part2.address);
    // console.log('Particle 2 deployed at address: ' + part2.address)
    // Deploy the third Particle contract with the same address of controller and sphere
    // const part3 = await deployer.deploy(Particle, controller.address, sphere.address, [120,125], [15,20], {overwrite: true, from: "0xE2F98A5218aBb122031710be0A82A9237B00d75e" });
    // await controller.addParticle(part3.address);
    //
    console.log("Deploying the other functions...");
    const rosenbrock = await deployer.deploy(Rosenbrock);
    const rastrigin = await deployer.deploy(Rastrigin);
    console.log("Deployed the other functions.");
    console.log("Changinh the target function to Rastrigin...");
    await controller.updateTargetFunction(rosenbrock.address);
    await controller.updateTargetFunction(rastrigin.address);

};
