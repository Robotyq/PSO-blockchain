const Controller = artifacts.require("Controller");
const Particle = artifacts.require("Particle");

module.exports = async function (callback) {
    try {
        const globalVar = await Controller.deployed();
        // Fetch all events from the Controller contract
        const globalVarEvents = await globalVar.getPastEvents('allEvents', {
            fromBlock: 0,
            toBlock: 'latest'
        });
        console.log('Controller Events:');
        // Format and print each Controller event
        globalVarEvents.forEach(event => {
            switch (event.event) {
                case 'UpdateVar':
                    console.log(`UpdateVar Event:
                                Particle: ${event.returnValues.particle}
                                Old Best Position: ${event.returnValues.old.bestPos}
                                Old Min Value: ${event.returnValues.old.minValue}
                                New Best Position: ${event.returnValues.newVar.bestPos}
                                New Min Value: ${event.returnValues.newVar.minValue}
                                `);
                    break;
                case 'ParticleBorn':
                    console.log(`ParticleBorn Event:
                                Particle: ${event.returnValues.particle}
                                Initial Position: ${event.returnValues.position}
                                Speed: ${event.returnValues.speed}
                                `);
                    break;
                case 'NewLocalMax':
                    console.log(`NewLocalMax Event:
                                Particle: ${event.returnValues.particle}
                                Old Value: ${event.returnValues.old}
                                New Value: ${event.returnValues.newVal}
                                `);
                    break;
                default:
                    console.log(`Unknown Event:
                                ${JSON.stringify(event, null, 2)}
                                `);
                    break;
            }
        });

        // Assume there are exactly 7 particles
        const particleCount = 7;

        console.log('Particle Events:');
        // Iterate over particle addresses and fetch their events
        for (let i = 0; i < particleCount; i++) {
            const address = await globalVar.particleAddresses(i);
            const particleInstance = await Particle.at(address);

            // Fetch all events from the Particle contract
            const particleEvents = await particleInstance.getPastEvents('allEvents', {
                fromBlock: 0,
                toBlock: 'latest'
            });

            // Format and print each Particle event
            particleEvents.forEach(event => {
                switch (event.event) {
                    case 'NewLocalMax':
                        console.log(`NewLocalMax Event from Particle at ${address}:
                                    Old Best Position: ${event.returnValues.old.bestPos}
                                    Old Min Value: ${event.returnValues.old.minValue}
                                    New Best Position: ${event.returnValues.newVal.bestPos}
                                    New Min Value: ${event.returnValues.newVal.minValue}
                                    `);
                        break;

                    default:
                        console.log(`Unknown Event from Particle at ${address}:
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
    }await globalVar.iterateAll
};
