// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
uint constant dimension = 2;

contract Controller {
    int[dimension + 1] public bestPoint;
    IParticle[] public particles;
    address public targetFunctionAddress;
    address public owner;

    event NewBestGlobal(address particle, int[dimension + 1] newVar);
    event ParticleAdded(address particle, address particleOwner, address controllerAddress);
    event TargetFunctionUpdated(address newTargetFunction);
    event ControllerDeployed(address thisContractAddress);

    constructor(address _targetFunctionContractAddress) payable {
        owner = msg.sender;
        targetFunctionAddress = _targetFunctionContractAddress;
        for (uint i = 0; i < dimension; i++) {
            bestPoint[i] = 0;
        }
        bestPoint[dimension] = int(2 ** 255 - 1);
        emit ControllerDeployed(address(this));
    }

    function setBestPoint(int[dimension + 1] calldata newVar) public {
        bestPoint = newVar;
        emit NewBestGlobal(msg.sender, bestPoint);
    }

    function getBestPoint() public view returns (int[dimension + 1] memory) {
        return bestPoint;
    }

    function iterateTimes(uint16 times) public {
        for(uint16 i = 0; i < times; i++) {
            for (uint j = 0; j < particles.length; j++) {
                particles[j].iterate();
            }
        }
    }

    function random(int min, int max, uint32 nonce) private view returns (int) {
        uint256 seed = uint256(keccak256(abi.encode(block.timestamp, msg.sender, nonce)));
        uint256 rand = seed % uint256(max - min + 1);
        return int(rand) + min;
    }

    function updateTargetFunction(address _newTargetFunctionAddress) public {
        require(msg.sender == owner, "Only the owner of the Controller can change its target function");
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

    function addParticle(address particleAddress, address particleOwner) public {
        // Create a new instance of the Particle contract
        IParticle particle = IParticle(particleAddress);

        // Add the new particle to the array of particles
        particles.push(particle);
        emit ParticleAdded(particleAddress, particleOwner, address(this));
    }

    function getParticlesCount() public view returns (uint) {
        return particles.length;
    }

}
interface IParticle {
    function iterate() external;
    function updateTargetFunction(address _newTargetFunctionAddress) external;
}