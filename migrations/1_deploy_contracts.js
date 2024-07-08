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
    console.log('Particle 2 deployed at address: ' + part2.address)
    // Deploy the third Particle from another account
    const part3 = await deployer.deploy(Particle, controller.address, [1200, 1250], [15, 20], {
        overwrite: true,
        from: "0xa8ED558Bf865Da50579DE0e9Cf69454B99686EC2"
    });
    const part4 = await deployer.deploy(Particle, controller.address, [1200, 1250], [15, 20], {
        overwrite: true,
        from: "0xa8ED558Bf865Da50579DE0e9Cf69454B99686EC2"
    });
    const part5 = deployer.deploy(Particle, controller.address, [1200, 1250], [15, 20], {
        overwrite: true,
        from: "0xa8ED558Bf865Da50579DE0e9Cf69454B99686EC2"
    });
    const part6 = deployer.deploy(Particle, controller.address, [1200, 1250], [15, 20], {
        overwrite: true,
        from: "0x0cE0bF20F5A388069Dea212db3EF16B20727C912"
    });
    const part7 = deployer.deploy(Particle, controller.address, [1200, 1250], [15, 20], {
        overwrite: true,
        from: "0x0cE0bF20F5A388069Dea212db3EF16B20727C912"
    });
    const part8 = deployer.deploy(Particle, controller.address, [1200, 1250], [15, 20], {
        overwrite: true,
        from: "0xeA87606153563C0dA246172f543f051AC273c814"
    });
    const part9 = await deployer.deploy(Particle, controller.address, [1200, 1250], [15, 20], {
        overwrite: true,
        from: "0xeA87606153563C0dA246172f543f051AC273c814"
    });
    const part10 = await deployer.deploy(Particle, controller.address, [1200, 1250], [15, 20], {
        overwrite: true,
        from: "0xCcF96d90C485782435D21FfE62e9bE3C3Ea597DE"
    });

    console.log("Deploying the other functions...");
    const rosenbrock = await deployer.deploy(Rosenbrock);
    const rastrigin = await deployer.deploy(Rastrigin);
    console.log("Deployed the other functions.");
    console.log("Changing the target function to Rastrigin...");
    await controller.updateTargetFunction(rastrigin.address);
    await controller.updateTargetFunction(rosenbrock.address);

    console.log('making the particles iterate for the first time...');
    await controller.iterateTimes(1, {from: accounts[0]});
    for (let i = 0; i < 10; i++) {
        part2.iterate(2, {from: accounts[0]});
        part3.iterate(1, {from: accounts[1]});
        part4.iterate(2, {from: accounts[1]});
        part5.iterate(1, {from: accounts[1]});
        part6.iterate(2, {from: accounts[4]});
        part7.iterate(1, {from: accounts[4]});
        part8.iterate(1, {from: accounts[2]});
        part9.iterate(1, {from: accounts[2]});
        part10.iterate(1, {from: accounts[3]});
        if (i % 2 === 0)
            part10.iterate(1, {from: accounts[3]});
        if (i % 3 === 0)
            part10.iterate(1, {from: accounts[3]});
        await part1.iterate(2, {from: accounts[0]});
    }
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
