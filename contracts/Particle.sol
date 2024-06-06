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
    uint private constant dimension = 2;
    int[dimension] public position;
    IFunction public targetFunction;
    int[dimension + 1] public localBest;
    int private localMin = 999999999999;
    int[dimension] private speed;
    int private nonce = 0;
    IController private controller;

    event NewLocalMin(address particle, Point3 old, Point3 newVal);

    constructor(address _controllerAddress, address _TargetContractAddress, int[dimension] memory initialPos, int[dimension] memory initialVelocity) payable {
        controller = IController(_controllerAddress);
        targetFunction = IFunction(_TargetContractAddress);
        position = initialPos;
        speed = initialVelocity;
        localBest = new int[](dimension + 1);
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
            for (uint i = 0; i < dimension - 1; i++) {
                localBest[i] = position[i];
            }
            localBest[dimension] = newVal;
            emit NewLocalMin(msg.sender, old, localBest);
            if (newVal < globalBest[dimension]) {
                controller.setBestPoint(localBest);
            }
        }
    }

    function findNewVal(int cogF, int socialF, int inertiaF, int[dimension] memory globalBest) private returns (int){
        int[dimension + 1] calldata newSpeed;
        uint maxSpeed = 30;
        for (uint i = 0; i < dimension; i++) {
            int newSpeedi = speed[i] * inertiaF / 100 + cogF * (localBest[i] - position[i]) / 100 + socialF * (globalBest[i] - position[i]) / 100;

            if (newSpeedi > maxSpeed) {
                newSpeedi = maxSpeed;
            } else if (newSpeedi < - maxSpeed) {
                newSpeedi = - maxSpeed;
            }

            newSpeed[i] = newSpeedi;

            position[i] = position[i] + newSpeed[i];
        }
        speed = newSpeed;
        int value = targetFunction.compute(position);
        return value;
    }


    function random(int min, int max) private returns (int){
        nonce++;
        uint rand = uint(keccak256(abi.encodePacked(block.blockhash(), this, nonce)));
        int randi = int(rand);
        int interval = max - min;
        return int(randi % interval + min);
    }
}

interface IController {
    function getBestPoint() external view returns (int[3] calldata);

    function setBestPoint(int[3] calldata newVar) external;
}