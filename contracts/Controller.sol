// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Particle.sol";

contract Controller {
    int[dimension + 1] public bestPoint;
    Particle[] public particles;
    address public targetFunctionAddress;

    event NewBestGlobal(address particle, int[dimension + 1] newVar);
    event ParticleAdded(address particle);
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
            emit ParticleAdded(address(newParticle));
        }
    }

    function setBestPoint(int[dimension + 1] calldata newVar) public {
        bestPoint = newVar;
        emit NewBestGlobal(msg.sender, bestPoint);
    }

    function getBestPoint() public view returns (int[dimension + 1] memory) {
        return bestPoint;
    }

    function iterateTimes(uint16 times) public {
        for (uint i = 0; i < particles.length; i++) {
            particles[i].iterate(times);
        }
    }

    function random(int min, int max, uint32 nonce) private view returns (int) {
        uint256 seed = uint256(keccak256(abi.encode(block.timestamp, msg.sender, nonce)));
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
        emit ParticleAdded(address(particle));
    }

    function getParticlesCount() public view returns (uint) {
        return particles.length;
    }
}
