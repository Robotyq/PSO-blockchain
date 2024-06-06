// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IFunction.sol";

    struct Point2 {
        int x;
        int y;
    }

    struct Point3 {
        int x;
        int y;
        int z;
    }

contract Particle {
    int[dimension] public position;
    IFunction public targetFunction;
    int[dimension + 1] public localBest;
    int private localMin = 999999999999;
    int[dimension] private speed;
    uint private nonce = 0;
    IController private controller;

    event NewLocalMin(address particle, Point3 old, Point3 newVal);

    constructor(address _controllerAddress, address _TargetContractAddress, int[dimension] memory initialPos, int[dimension] memory initialVelocity) payable {
        controller = IController(_controllerAddress);
        targetFunction = IFunction(_TargetContractAddress);
        position = initialPos;
        speed = initialVelocity;
        for (uint i = 0; i < dimension; i++) {
            localBest[i] = position[i];
        }
        localBest[dimension] = localMin;
    }

    function iterate() public {
        int socialFactor = random(45, 90);
        int cognitiveFactor = 100 - socialFactor;
        int[dimension + 1] memory globalBest = controller.getBestPoint();

        int newVal = findNewVal(cognitiveFactor, socialFactor, 33, globalBest);
        if (newVal < localBest[dimension]) {
            int[dimension + 1] memory old = localBest;
            for (uint i = 0; i < dimension; i++) {
                localBest[i] = position[i];
            }
            localBest[dimension] = newVal;
            emit NewLocalMin(msg.sender, Point3(old[0], old[1], old[2]), Point3(localBest[0], localBest[1], localBest[2]));
            if (newVal < globalBest[dimension]) {
                controller.setBestPoint(localBest);
            }
        }
    }

    function findNewVal(int cogF, int socialF, int inertiaF, int[dimension + 1] memory globalBest) private returns (int) {
        int[dimension] memory newSpeed;
        int maxSpeed = 30;
        for (uint i = 0; i < dimension; i++) {
            int newSpeedi = speed[i] * inertiaF / 100 + cogF * (localBest[i] - position[i]) / 100 + socialF * (globalBest[i] - position[i]) / 100;

            if (newSpeedi > maxSpeed) {
                newSpeedi = maxSpeed;
            } else if (newSpeedi < -maxSpeed) {
                newSpeedi = -maxSpeed;
            }

            newSpeed[i] = newSpeedi;
            position[i] = position[i] + newSpeed[i];
        }
        speed = newSpeed;
        int value = targetFunction.compute(position);
        return value;
    }

    function random(int min, int max) private returns (int) {
        nonce++;
        uint rand = uint(keccak256(abi.encodePacked(blockhash(block.number - 1), msg.sender, nonce)));
        int randi = int(rand);
        int interval = max - min;
        return randi % interval + min;
    }
}

interface IController {
    function getBestPoint() external view returns (int[3] memory);

    function setBestPoint(int[3] memory newVar) external;
}
