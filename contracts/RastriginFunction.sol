// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./IFunction.sol";

contract RastriginFunction is IFunction {
    int private factor = 10;  // Commonly used factor for Rastrigin function

    function compute(int[dimension] calldata dimensions) external pure override returns (int) {
        int A = int(factor);
        int sum = A * int(dimensions.length);  // Initialize sum to n * A
        for (uint i = 0; i < dimensions.length; i++) {
            sum += (dimensions[i]**2 - A * int(cos(2 * pi() * dimensions[i])));
        }
        return sum;
    }

    function getFactor() external view override returns (int) {
        return factor;
    }

    function setFactor(int _factor) external override {
        factor = _factor;
    }

    // Helper function to approximate PI
    function pi() private pure returns (int) {
        return 3141592653 / 1000000000;  // PI approximation with scaling to maintain precision
    }

    // Helper function to approximate cosine using Taylor Series for demonstration purposes
    function cos(int x) private pure returns (int) {
        int term1 = 1000000000;  // 1 * 10^9
        int term2 = - (x**2 / 2000000000);  // -x^2/2!
        int term3 = (x**4 / 240000000000000000);  // x^4/4!

        return (term1 + term2 + term3);
    }
}
