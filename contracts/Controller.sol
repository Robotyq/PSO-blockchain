// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
uint constant dimension = 2;

interface IParticle {
//    function position(uint256) external view returns (int256);
//    function currentValue() external view returns (int256);
//    function localBest(uint256) external view returns (int256);
    function iterate(uint16 times) external;

    function updateTargetFunction(address _newTargetFunctionAddress) external;
}

contract Controller {
    int[dimension + 1] public bestPoint;
    IParticle[] public particles;
    address public targetFunctionAddress;

    event NewBestGlobal(address particle, int[dimension + 1] newVar);
    event ParticleAdded(address particle);
    event TargetFunctionUpdated(address newTargetFunction);

    constructor(address _targetFunctionContractAddress) payable {
        targetFunctionAddress = _targetFunctionContractAddress;
        for (uint i = 0; i < dimension; i++) {
            bestPoint[i] = 0;
        }
        bestPoint[dimension] = int(2 ** 255 - 1);
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
        bestPoint[dimension] = int(2 ** 255 - 1);
        for (uint i = 0; i < particles.length; i++) {
            particles[i].updateTargetFunction(_newTargetFunctionAddress);
        }
    }

    function addParticle(address particleAddress) public {
        // Create a new instance of the Particle contract
        IParticle particle = IParticle(particleAddress);
        // Add the new particle to the array of particles
        particles.push(particle);
        emit ParticleAdded(address(particle));
    }

    function getParticlesCount() public view returns (uint) {
        return particles.length;
    }

}