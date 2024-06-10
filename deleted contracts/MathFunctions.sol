//// SPDX-License-Identifier: UNLICENSED
//pragma solidity ^0.8.0;
//
//library MathFunctions {
//    // Calculate the square root of x
//    function sqrt(uint x) internal pure returns (uint) {
//        uint z = (x + 1) / 2;
//        uint y = x;
//        while (z < y) {
//            y = z;
//            z = (x / z + z) / 2;
//        }
//        return y;
//    }
//
//    // Calculate the exponential function e^x using Taylor series expansion
//    function exp(uint x) internal pure returns (uint) {
//        uint256 nFact = 1;
//        uint256 ePowX = 1;
//        uint256 result = 1;
//
//        for (uint256 i = 1; i <= 20; i++) {
//            nFact *= i;
//            ePowX *= x;
//            result += ePowX / nFact;
//        }
//        return result;
//    }
//
//    // Calculate the cosine function using Taylor series expansion
//    function cos(uint x) internal pure returns (uint) {
//        int256 xRad = x * 314159 / 180; // Convert degrees to radians
//        int256 result = 1;
//        int256 sign = -1;
//
//        for (uint256 i = 2; i <= 20; i += 2) {
//            uint256 term = exp(i) * xRad**i / 10**20;
//            result += sign * term;
//            sign = -sign;
//        }
//        return result;
//    }
//}
