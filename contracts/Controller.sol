// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Particle.sol";


contract Controller {
    int[dimension + 1] public bestPoint;
    address[] public particleAddresses;

    event UpdateVar(address particle, int[dimension + 1] old, int[dimension + 1] newVar);
    event ParticleBorn(address particle, int[dimension] position, int[dimension] speed);
    event NewLocalMax(address particle, int[dimension + 1] old, int[dimension + 1] newVal);


    constructor(int initialParticles, address _targetFunctionContractAddress) payable {
        bestPoint = (0, 9999999);
        for (int i = 0; i < initialParticles; i++) {
            int start = random(- 600, 600, i);
            int velocity = random(- 40, 40, - i);
            Particle newParticle = (new Particle){value: 1 ether}(address(this), _targetFunctionContractAddress, start, velocity);
            particleAddresses.push(address(newParticle));
            emit ParticleBorn(address(newParticle), start, velocity);
        }
    }

    function setBestPoint(int[dimension + 1] calldata newVar) public {
        emit UpdateVar(msg.sender, bestPoint, newVar);
        bestPoint = newVar;
    }

    function getBestPoint() public view returns (int[dimension + 1] memory){
        return bestPoint;
    }

    function iterateAll() public {
        for (uint i; i < particleAddresses.length; i++) {
            Particle(particleAddresses[i]).iterate();
        }
    }

    function random(int min, int max, int nonce) private view returns (int) {
        uint256 seed = uint256(keccak256(abi.encode(block.timestamp, block.difficulty, msg.sender, nonce)));
        uint256 rand = seed % uint256(max - min + 1);
        return int(rand) + min;
    }

}