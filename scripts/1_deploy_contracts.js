const Particle = artifacts.require("Particle");
const Controller = artifacts.require("Controller");
const Sphere = artifacts.require("SphereFunction");
const Rosenbrock = artifacts.require("RosenbrockFunction");
const Rastrigin = artifacts.require("RastriginFunction");

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(Sphere, { overwrite: true });
    const sphere = await Sphere.deployed();
    await deployer.deploy(Controller, sphere.address, { value: web3.utils.toWei('1', 'ether') });
    const controller = await Controller.deployed();

    // Deploy Particle contracts using accounts dynamically
    const particlesData = [
        { position: [152, 150], speed: [20, 25], accountIndex: 0 },
        { position: [132, 130], speed: [30, 23], accountIndex: 0 },
        { position: [1200, 1250], speed: [15, 20], accountIndex: 1 },
        { position: [1200, 1250], speed: [15, 20], accountIndex: 1 },
        { position: [1200, 1250], speed: [15, 20], accountIndex: 1 },
        { position: [1200, 1250], speed: [15, 20], accountIndex: 2 },
        { position: [1200, 1250], speed: [15, 20], accountIndex: 2 },
        { position: [1200, 1250], speed: [15, 20], accountIndex: 3 },
        { position: [1200, 1250], speed: [15, 20], accountIndex: 3 },
        { position: [1200, 1250], speed: [15, 20], accountIndex: 4 }
    ];

    for (const data of particlesData) {
        const particle = await deployer.deploy(Particle, controller.address, data.position, data.speed, {
            overwrite: true,
            from: accounts[data.accountIndex]
        });
        console.log(`Particle deployed at address: ${particle.address} from account: ${accounts[data.accountIndex]}`);
    }

    console.log("Deploying the other functions...");
    const rosenbrock = await deployer.deploy(Rosenbrock);
    const rastrigin = await deployer.deploy(Rastrigin);
    console.log("Deployed the other functions.");
    console.log("Changing the target function to Rastrigin...");
    await controller.updateTargetFunction(rastrigin.address);
    await controller.updateTargetFunction(rosenbrock.address);

    // Iterate over particles using accounts dynamically
    let promises = [];
    for (let i = 0; i < 10; i++) {
        console.log('Making the particles iterate for the ' + (i + 2) + 'th time...');
        for (let j = 0; j < particlesData.length; j++) {
            const account = accounts[particlesData[j].accountIndex];
            const particleInstance = new web3.eth.Contract(Particle.abi, particlesData[j].address);
            promises.push(particleInstance.methods.iterate().send({ from: account }));
        }
        console.log('Waiting for all promises to complete...');
        await Promise.all(promises);
        promises = [];
    }
};
