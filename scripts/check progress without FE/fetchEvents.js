const Controller = artifacts.require("Controller");
const Particle = artifacts.require("Particle");

module.exports = async function (callback) {
    try {
        const controller = await Controller.deployed();

        // Get the current block number
        const currentBlockNumber = await web3.eth.getBlockNumber();
        const fromBlock = Math.max(currentBlockNumber - 5, 0);

        // Fetch all events from the Controller contract from the last 10 blocks
        const controllerEvents = await controller.getPastEvents('allEvents', {
            fromBlock: fromBlock,
            toBlock: 'latest'
        });

        console.log('Controller Events:');
        // Format and print each Controller event
        controllerEvents.forEach(event => {
            switch (event.event) {
                case 'NewBestGlobal':
                    console.log(`UpdateVar Event:
                                Particle: ${event.returnValues.particle}
                                Old Value: ${event.returnValues.old}
                                New Value: ${event.returnValues.newVar}
                                `);
                    break;
                case 'ParticleBorn':
                    console.log(`ParticleBorn Event:
                                Particle: ${event.returnValues.particle}
                                Position: ${event.returnValues.position}
                                Speed: ${event.returnValues.speed}
                                `);
                    break;
                case 'TargetFunctionUpdated':
                    console.log(`TargetFunctionUpdated Event:
                                New Target Function: ${event.returnValues.newTargetFunction}
                                `);
                    break;
                default:
                    console.log(`Unknown Event from Controller:
                                ${JSON.stringify(event, null, 2)}
                                `);
                    break;
            }
        });

        // Fetch the number of particles from the Controller contract
        let particleCount = await controller.getParticlesCount();
        console.log('Particle(' + particleCount + ') Events:');
// Iterate over particle addresses and fetch their events
        for (let i = 0; i < particleCount; i++) {
            const particleAddress = await controller.particles(i);
            const particleInstance = await Particle.at(particleAddress);

            // Fetch all events from the last 10 blocks
            const particleEvents = await particleInstance.getPastEvents('allEvents', {
                fromBlock: fromBlock,
                toBlock: 'latest'
            });

            // Format and print each Particle event
            particleEvents.forEach(event => {
                switch (event.event) {
                    case 'NewLocalMin':
                        console.log(`NewLocalMin Event from Particle at ${particleAddress}:
                                    Old Position: ${event.returnValues.old.x}, ${event.returnValues.old.y}, ${event.returnValues.old.z}
                                    New Position: ${event.returnValues.newVal.x}, ${event.returnValues.newVal.y}, ${event.returnValues.newVal.z}
                                    `);
                        break;
                    default:
                        console.log(`Unknown Event from Particle at ${particleAddress}:
                                    ${JSON.stringify(event, null, 2)}
                                    `);
                        break;
                }
            });
        }
        callback();
    } catch (error) {
        console.error(error);
        callback(error);
    }
};