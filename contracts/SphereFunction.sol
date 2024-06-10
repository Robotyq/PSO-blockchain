// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./IFunction.sol";

contract SphereFunction is IFunction {
    int private factor = 2;

    function compute(int[dimension] calldata positions) external view override returns (int) {
//        int pow2 = positions[0] ** 2 / 10000;
//        int pow1 = positions[1] / 100;
//        return int(factor) * pow2 - int(factor) * pow1 + 2;
        int x= positions[0];
        int y= positions[1];
        return factor * x*x + y*y;
    }

    function getFactor() external view override returns (int) {
        return factor;
    }

    function setFactor(int _factor) external override {
        factor = _factor;
    }
}
