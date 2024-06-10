// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Particle.sol";

contract Controller {
    int[dimension + 1] public bestPoint;
    Particle[] public particles;
    address public targetFunctionAddress;

    event NewBestGlobal(address particle, int[dimension + 1] old, int[dimension + 1] newVar);
    event ParticleBorn(address particle, int[dimension] position, int[dimension] speed);
    event TargetFunctionUpdated(address newTargetFunction);

    constructor(uint8 initialParticles, address _targetFunctionContractAddress) payable {
        targetFunctionAddress = _targetFunctionContractAddress;
        for (uint i = 0; i < dimension; i++) {
            bestPoint[i] = 0;
        }
        bestPoint[dimension] = int(2**255 - 1);
        for (uint16 i = 0; i < initialParticles; i++) {
            int[dimension] memory start;
            int[dimension] memory velocity;
            for (uint8 j = 0; j < dimension; j++) {
                start[j] = random(- 600, 600, i * (j+1));
                velocity[j] = random(- 40, 40, 200 * i * (j+1));
            }
            Particle newParticle = (new Particle){value: 1 ether}(address(this), _targetFunctionContractAddress, start, velocity);
            particles.push(newParticle);
            emit ParticleBorn(address(newParticle), start, velocity);
        }
    }

    function setBestPoint(int[dimension + 1] calldata newVar) public {
        emit NewBestGlobal(msg.sender, bestPoint, newVar);
        bestPoint = newVar;
    }

    function getBestPoint() public view returns (int[dimension + 1] memory) {
        return bestPoint;
    }

    function iterateAll() public {
        for (uint i = 0; i < particles.length; i++) {
            particles[i].iterate();
        }
    }

    function iterateTimes(uint16 times) public {
        for (uint i = 0; i < times; i++) {
            iterateAll();
        }
    }

    function random(int min, int max, uint32 nonce) private view returns (int) {
        uint256 seed = uint256(keccak256(abi.encode(block.timestamp, block.difficulty, msg.sender, nonce)));
        uint256 rand = seed % uint256(max - min + 1);
        return int(rand) + min;
    }

    function updateTargetFunction(address _newTargetFunctionAddress) public {
        targetFunctionAddress = _newTargetFunctionAddress;
        emit TargetFunctionUpdated(_newTargetFunctionAddress);
        for (uint i = 0; i < dimension; i++) {
            bestPoint[i] = 0;
        }
        bestPoint[dimension] = int(2**255 - 1);
        for (uint i = 0; i < particles.length; i++) {
            particles[i].updateTargetFunction(_newTargetFunctionAddress);
        }
    }

    function addParticle(address particleAddress) public {
        // Create a new instance of the Particle contract
        Particle particle = Particle(particleAddress);
        // Add the new particle to the array of particles
        particles.push(particle);
        int[dimension] memory position;
        int[dimension] memory speed;
        for (uint i = 0; i < dimension; i++) {
            position[i] = particle.position(i);
        }
        for (uint i = 0; i < dimension; i++) {
            speed[i] = particle.speed(i);
        }
        emit ParticleBorn(address(particle), position, speed);
    }

    function getParticlesCount() public view returns (uint) {
        return particles.length;
    }
}
