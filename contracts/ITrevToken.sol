// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITrevToken  {

  function getBlackListStatus(address _user) external view returns(bool);

  function mint(uint256 amount) external;

  function setValueOfVote(uint256) external returns(bool);
}
