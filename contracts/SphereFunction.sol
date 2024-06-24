// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IFunction.sol";

contract SphereFunction is IFunction {
    int private factor = 200;

    constructor() {
        emit FunctionContractDeployed(address(this));
    }

    function compute(int[dimension] calldata positions) external view override returns (int) {
        int x = positions[0];
        x-=factor;
        int y = positions[1];
        y-=factor;
        return factor * x * x + y * y;
    }

    function getFactor() external view override returns (int) {
        return factor;
    }

    function setFactor(int _factor) external override {
        factor = _factor;
    }
}
