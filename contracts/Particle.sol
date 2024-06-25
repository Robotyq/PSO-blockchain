// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IFunction.sol";
int16 constant maxSpeed = 50;

contract Particle {
    int[dimension] public position;
    int[dimension] public speed;
    int public currentValue = int(2 ** 255 - 1);
    int[dimension + 1] public localBest;
    IFunction public targetFunction;
    IController private controller;
    uint private nonce = 0;
    address private _owner;

    event NewLocalMin(address particle, int[dimension + 1] newVal);

    constructor(address _controllerAddress, address _TargetContractAddress, int[dimension] memory initialPos, int[dimension] memory initialVelocity) payable {
        controller = IController(_controllerAddress);
        targetFunction = IFunction(_TargetContractAddress);
        position = initialPos;
        speed = initialVelocity;
        for (uint i = 0; i < dimension; i++) {
            localBest[i] = position[i];
        }
        localBest[dimension] = int(2 ** 255 - 1);
        _owner = msg.sender;
        controller.addParticle(address(this));
    }

    function iterate(uint16 times) public {
        for (uint16 i = 0; i < times; i++) {
            iterate();
        }
    }

    function iterate() public {
        require(msg.sender == _owner || msg.sender == address(controller), "Only the owner or the Controller can iterate");
        int socialFactor = random(45, 90);
        int cognitiveFactor = 100 - socialFactor;
        int[dimension + 1] memory globalBest = controller.getBestPoint();
        advance(cognitiveFactor, socialFactor, 33, globalBest);
        currentValue = targetFunction.compute(position);
        if (currentValue < localBest[dimension]) {
            for (uint i = 0; i < dimension; i++) {
                localBest[i] = position[i];
            }
            localBest[dimension] = currentValue;
            emit NewLocalMin(msg.sender, localBest);
            if (currentValue < globalBest[dimension]) {
                controller.setBestPoint(localBest);
            }
        }
    }

    function advance(int cogF, int socialF, int inertiaF, int[dimension + 1] memory globalBest) private {
        int[dimension] memory newSpeed;
        for (uint i = 0; i < dimension; i++) {
            int newSpeedi = speed[i] * inertiaF / 100 + cogF * (localBest[i] - position[i]) / 100 + socialF * (globalBest[i] - position[i]) / 100;
            newSpeedi += random(- newSpeedi / 10, newSpeedi / 10);
            newSpeedi += random(- 6, 6);
            newSpeed[i] = newSpeedi;
            position[i] = position[i] + newSpeed[i];
        }
        speed = newSpeed;
    }

    function random(int min, int max) private returns (int) {
        if (max == min) {
            return min;
        }
        if (max < min) {
            int temp = max;
            max = min;
            min = temp;
        }
        nonce++;
        uint rand = uint(keccak256(abi.encodePacked(block.number - 1, nonce, this)));
        int randi = int(rand);
        int interval = max - min;
        return randi % interval + min;
    }

    function updateTargetFunction(address _newTargetFunctionAddress) external {
        require(msg.sender == address(controller), "Only the controller can update the target function");
        targetFunction = IFunction(_newTargetFunctionAddress);
        for (uint i = 0; i < dimension; i++) {
            localBest[i] = 0;
        }
        localBest[dimension] = int(2 ** 255 - 1);
    }

    function getOwner() external view returns (address) {
        return _owner;
    }
}

interface IController {
    function getBestPoint() external view returns (int[3] memory);

    function setBestPoint(int[3] memory newVar) external;

    function addParticle(address particleAddress) external;
}
