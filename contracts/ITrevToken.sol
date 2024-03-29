// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITrevToken  {

  function getBlackListStatus(address _user) external view returns(bool);

  function mint(uint256 _amount) external;

  function initializeDAOContractOnTokenContract(address _address, uint256 _amount) external;
}