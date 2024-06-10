// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./IFunction.sol";
import "./Trigonometry.sol";

contract RastriginFunction is IFunction {
    int private factor = 10 * 10**18;  // Factor scaled by 18 decimals

    constructor() {
        emit FunctionContractDeployed(address(this));
    }

    function compute(int[2] calldata dimensions) external view override returns (int) {
        int A = factor;
        int sum = A * int(dimensions.length);  // Initialize sum to n * A
        for (uint i = 0; i < dimensions.length; i++) {
            int xi = dimensions[i] * 10**18; // Scale input to 18 decimals
            int term1 = (xi * xi) / 10**18; // Scale down after squaring
            int term2 = (A * Trigonometry.cos(uint256((2 * pi() * xi) / 10**18))) / 10**18; // Scale down after cosine
            sum += (term1 - term2);
        }
        return sum;
    }

    function getFactor() external view override returns (int) {
        return factor;
    }

    function setFactor(int _factor) external override {
        factor = _factor * 10**18; // Scale factor by 18 decimals
    }

    // Helper function to get PI
    function pi() private pure returns (int) {
        return 3141592653589793238;  // PI scaled by 18 decimals
    }
}
