// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IFunction.sol";

contract SphereFunction is IFunction {
    int private factor = 200;

    constructor() {
        emit FunctionContractDeployed(address(this), "Sphere Function");
    }

    function compute(int[dimension] calldata positions) external view override returns (int) {
        int sum = 0;
        for(uint i=0; i<dimension;i++){
            int termen = positions[i];
            termen-=factor;
            sum+=termen*termen;
        }
        return  sum;
    }

    function getFactor() external view override returns (int) {
        return factor;
    }

    function setFactor(int _factor) external override {
        factor = _factor;
    }

    function name() external pure returns (string memory){
        return "Sphere Function";
    }
}
