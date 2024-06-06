// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Particle.sol";

contract Controller {
    int[dimension + 1] public bestPoint;
    address[] public particleAddresses;

    event UpdateVar(address particle, int[dimension + 1] old, int[dimension + 1] newVar);
    event ParticleBorn(address particle, int[dimension] position, int[dimension] speed);
    event NewLocalMax(address particle, int[dimension + 1] old, int[dimension + 1] newVal);

    constructor(uint8 initialParticles, address _targetFunctionContractAddress) payable {
        for (uint i = 0; i < dimension; i++) {
            bestPoint[i] = 0;
        }
        bestPoint[dimension] = 9999999;
        for (uint8 i = 0; i < initialParticles; i++) {
            int[dimension] memory start;
            int[dimension] memory velocity;
            for (uint8 j = 0; j < dimension; j++) {
                start[j] = random(- 600, 600, i * j);
                velocity[j] = random(- 40, 40, 200 * i * j);
            }
            Particle newParticle = (new Particle){value: 1 ether}(address(this), _targetFunctionContractAddress, start, velocity);
            particleAddresses.push(address(newParticle));
            emit ParticleBorn(address(newParticle), start, velocity);
        }
    }

    function setBestPoint(int[dimension + 1] calldata newVar) public {
        emit UpdateVar(msg.sender, bestPoint, newVar);
        bestPoint = newVar;
    }

    function getBestPoint() public view returns (int[dimension + 1] memory) {
        return bestPoint;
    }

    function iterateAll() public {
        for (uint i = 0; i < particleAddresses.length; i++) {
            Particle(particleAddresses[i]).iterate();
        }
    }

    function random(int min, int max, uint16 nonce) private view returns (int) {
        uint256 seed = uint256(keccak256(abi.encode(block.timestamp, block.difficulty, msg.sender, nonce)));
        uint256 rand = seed % uint256(max - min + 1);
        return int(rand) + min;
    }
}
