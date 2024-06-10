// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TargetFunction {
    int coef1 = 2;

    function compute(int x) public view returns (int) {
        int pow4 = x ** 4 / 100000000;
        int pow3 = x ** 3 / 1000000;
        int pow2 = x ** 2 / 10000;
        int pow1 = x / 100;
        return pow4 + coef1 * pow3 - 2 * pow2 - 2 * pow1 + 2;
    }
}
