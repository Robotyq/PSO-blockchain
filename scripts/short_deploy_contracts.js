const Particle = artifacts.require("Particle");
const Controller = artifacts.require("Controller");
const Sphere = artifacts.require("SphereFunction");
const Rosenbrock = artifacts.require("RosenbrockFunction");
const Rastrigin = artifacts.require("RastriginFunction");
module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(Sphere);
    const sphere = await Sphere.deployed();
    await deployer.deploy(Controller, sphere.address, {'value': web3.utils.toWei('1', 'ether')});
    const controller = await Controller.deployed();

    // Deploy the first Particle contract with the address of controller
    const part1 = await deployer.deploy(Particle, controller.address, [152, 150], [20, 25], {overwrite: true});
    // nu mai trebe, se face in constructorul particulei // await controller.addParticle(part1.address);
    console.log('Particle 1 deployed at address: ' + part1.address)
    // Deploy the second Particle contract with the same address of controller
    const part2 = await deployer.deploy(Particle, controller.address, [132, 130], [30, 23], {overwrite: true});
    console.log('Particle 2 deployed at address: ' + part2.address);

};


// const Particle = artifacts.require("Particle");
// const Controller = artifacts.require("Controller");
// module.exports = async function (deployer, network, accounts) {
//     const controller = await Controller.deployed();
//     // Deploy another Particle contract with the address of controller
//     const part1 = await deployer.deploy(Particle, controller.address, [152,150], [20,25], {overwrite: true, from: "0x61d6Bd357Fc7E9bc559E8f97e437D08494a8261f"});
//     // nu mai trebe, se face in constructorul particulei // await controller.addParticle(part1.address);
//     console.log('Particle 1 deployed at address: ' + part1.address)
//
//     console.log('making the particles iterate for the first time...');
//     await controller.iterateTimes(1);
// };


// const Sphere = artifacts.require("SphereFunction");
// module.exports = async function (deployer, network, accounts) {
//     await deployer.deploy(Sphere);
//     const sphere = await Sphere.deployed();
//     console.log('New Sphere function deployed at address: ' + sphere.address)
// };
