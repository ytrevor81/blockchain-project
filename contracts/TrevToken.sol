// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ITrevToken.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TrevToken is ERC20, Ownable, ITrevToken {

  address private daoAddress;
  uint256 private valueOfDAOVote;

  constructor() ERC20("Trev Token", "TTK") {
    _mint(_msgSender(), 100000000 * 10 ** uint256(decimals()));
  }

  mapping (address => bool) private isBlackListed;

  event AddedBlackList (address indexed _user);
  event RemovedBlackList (address indexed _user);
  event DAOAddressAssigned (address _user, address _daoAddress);
  event ValueOfDAOVoteSet (address _user, uint256 _valueOfDAOVote);

  function transfer(address recipient, uint256 amount) public override returns (bool) {
    require(isBlackListed[_msgSender()] == false, "Sender is on BlackList");
    require(isBlackListed[recipient] == false, "Recipient is on BlackList");
    _transfer(_msgSender(), recipient, amount);
    return true;
  }

  function approveForDAOVote() external returns(bool) {
    approve(daoAddress, valueOfDAOVote);
    return true;
  }

  function approve(address spender, uint256 amount) public override returns (bool) {
    require(isBlackListed[_msgSender()] == false, "Recipient is on BlackList");
    address owner = _msgSender();
    _approve(owner, spender, amount);
    return true;
  }

  function mint (uint256 amount) external override {
    require(_msgSender() == daoAddress, "Only Trev DAO can mint tokens");
    _mint(daoAddress, amount);
  }

  function getBlackListStatus(address _user) external view override returns(bool) {
    return isBlackListed[_user];
  }

  function addToBlackList(address _user) external onlyOwner returns(bool) {
    isBlackListed[_user] = true;
    emit AddedBlackList(_user);
    return true;
  }

  function removeFromBlackList (address _user) external onlyOwner returns(bool) {
    isBlackListed[_user] = false;
    emit RemovedBlackList(_user);
    return true;
  }

  function viewDAOAddress() public view returns(address) {
    return daoAddress;
  }

  function viewValueAmountFromDAO() public view returns(uint256) {
    return valueOfDAOVote;
  }

  function addDAOAddress(address _dao) external onlyOwner returns(bool) {
    daoAddress = _dao;
    emit DAOAddressAssigned(_msgSender(), _dao);
    return true;
  }

  function setValueOfVote(uint256 _value) external override returns(bool) {
    require(_msgSender() == daoAddress, "Setting has to be dao address");
    valueOfDAOVote = _value;
    emit ValueOfDAOVoteSet(_msgSender(), _value);
    return true;
  }
}
