// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
uint constant dimension = 2;
interface IFunction {
    function compute(int[dimension] calldata positions) external view returns (int);

    function getFactor() external view returns (int);

    function name() external pure returns (string memory);

    function setFactor(int _factor) external;

    event FunctionContractDeployed(address thisContractAddress, string name);
}
