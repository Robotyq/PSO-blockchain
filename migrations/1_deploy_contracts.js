const Particle = artifacts.require("Particle");
const Controller = artifacts.require("Controller");
const Sphere = artifacts.require("SphereFunction");
const Rosenbrock = artifacts.require("RosenbrockFunction");
const Rastrigin = artifacts.require("RastriginFunction");
module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(Sphere, {overwrite: true});
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
    // Deploy the third Particle from another account
    const part3 = await deployer.deploy(Particle, controller.address, [1200, 1250], [15, 20], {
        overwrite: true,
        from: "0x5a5BEa10b4dEAF92386b55bb5981468f113A5bbA"
    });
    const part4 = await deployer.deploy(Particle, controller.address, [1200, 1250], [15, 20], {
        overwrite: true,
        from: "0x5a5BEa10b4dEAF92386b55bb5981468f113A5bbA"
    });
    const part5 = await deployer.deploy(Particle, controller.address, [1200, 1250], [15, 20], {
        overwrite: true,
        from: "0x5a5BEa10b4dEAF92386b55bb5981468f113A5bbA"
    });
    const part6 = await deployer.deploy(Particle, controller.address, [1200, 1250], [15, 20], {
        overwrite: true,
        from: "0x3Eb94Ed0D6F468b353132FcB92E5d0f723Df62a1"
    });
    const part7 = await deployer.deploy(Particle, controller.address, [1200, 1250], [15, 20], {
        overwrite: true,
        from: "0x3Eb94Ed0D6F468b353132FcB92E5d0f723Df62a1"
    });
    const part8 = await deployer.deploy(Particle, controller.address, [1200, 1250], [15, 20], {
        overwrite: true,
        from: "0x57b577aFa0EfF09Db0CfB99F2d96c527341c466a"
    });
    const part9 = await deployer.deploy(Particle, controller.address, [1200, 1250], [15, 20], {
        overwrite: true,
        from: "0x57b577aFa0EfF09Db0CfB99F2d96c527341c466a"
    });
    const part10 = await deployer.deploy(Particle, controller.address, [1200, 1250], [15, 20], {
        overwrite: true,
        from: "0xe2fadBBCbb071Ee258D7607233cf34e455080852"
    });

    console.log("Deploying the other functions...");
    const rosenbrock = await deployer.deploy(Rosenbrock);
    const rastrigin = await deployer.deploy(Rastrigin);
    console.log("Deployed the other functions.");
    console.log("Changing the target function to Rastrigin...");
    await controller.updateTargetFunction(rastrigin.address);
    await controller.updateTargetFunction(rosenbrock.address);
    //
    // console.log('making the particles iterate for the first time...');
    // await controller.iterateTimes(1, {from: accounts[0]});

    let promises = [];
    for (let i = 0; i < 10; i++) {
        console.log('making the particles iterate for the ' + (i + 2) + 'th time...');
        promises.push(part1.iterate({from: accounts[0]}));
        promises.push(part1.iterate({from: accounts[0]}));
        console.log('part1 iterated');
        promises.push(part2.iterate({from: accounts[0]}));
        promises.push(part2.iterate({from: accounts[0]}));
        promises.push(part3.iterate({from: accounts[1]}));
        promises.push(part4.iterate({from: accounts[1]}));
        promises.push(part4.iterate({from: accounts[1]}));
        promises.push(part5.iterate({from: accounts[1]}));
        // Await all promises to complete in the same block
        console.log('waiting for all promises to complete...')
        await Promise.all(promises);
        promises.push(part6.iterate({from: accounts[2]}));
        promises.push(part7.iterate({from: accounts[2]}));
        promises.push(part8.iterate({from: accounts[3]}));
        promises.push(part9.iterate({from: accounts[3]}));
        promises.push(part10.iterate({from: accounts[4]}));
        if (i % 2 === 0){
            promises.push(part10.iterate({from: accounts[4]}));
        }
        if (i % 3 === 0){
            promises.push(part10.iterate({from: accounts[4]}));
        }
        // Await all promises to complete in the same block
        console.log('waiting for all promises to complete...')
        await Promise.all(promises);
        promises=[];
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
