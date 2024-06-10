const Controller = artifacts.require("Controller");
const Particle = artifacts.require("Particle");
const fs = require('fs');
const path = require('path');
const dimension = 2;

module.exports = async function (callback) {
    try {
        const controller = await Controller.deployed();
        const particleCount = await controller.getParticlesCount();

        let positions = [];
        // Iterate over particles and fetch their positions
        for (let i = 0; i < particleCount; i++) {
            const particleAddress = await controller.particles(i);
            const particleInstance = await Particle.at(particleAddress);
            // Fetch the position directly from the Particle contract's storage
            let position =[];
            for(let j = 0; j < dimension; j++){
                position.push(await particleInstance.position(j));
            }
            positions.push({
                particle: particleInstance.address,
                position: position.map(pos => pos.toString()) // Convert to string for JSON serialization
            });
        }

        // Save positions to a JSON file for plotting
        const outputFile = path.join(__dirname, 'positions.json');
        fs.writeFileSync(outputFile, JSON.stringify(positions, null, 2));

        console.log('Positions saved to positions.json');

        callback();
    } catch (error) {
        console.error(error);
        callback(error);
    }
};