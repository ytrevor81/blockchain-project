// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ITrevToken.sol";

contract TrevDAO {

  address public trevTokenAddress;
  address public governor;
  uint256 public votingPeriod;

  uint256 private valueOfEachVote;
  uint256 private proposalIDCounter;
  uint256 private quorum;

  enum ProposalState { Active, Defeated, Suceeded }

  struct Proposal {
    uint256 proposalID;
    bytes32 description;
    address proposer;
    uint256 dateProposed;
    uint256 deadline;
  }

  Proposal[] proposals; //stored list of all proposals

  //proposal ID => state
  mapping (uint256 => ProposalState) public stateOfProposal;

  //proposal ID => numVotesFor
  mapping (uint256 => uint256) public votesForProposal;

  //proposal ID => numVotesAgainst
  mapping (uint256 => uint256) public votesAgainstProposal;

  constructor (address _trevTokenAddress) {
    trevTokenAddress = _trevTokenAddress;
    governor = msg.sender;
    proposalIDCounter = 0;
    quorum = 2;
    votingPeriod = 10 minutes;

    bytes memory decimalsFunctionCall = abi.encodeWithSignature("decimals()");
    (bool success, bytes memory returnData) = trevTokenAddress.call(decimalsFunctionCall);

    if (success) 
    {
      uint8 decimals = abi.decode(returnData, (uint8));
      valueOfEachVote = 1 * 10 ** uint256(decimals);
      ITrevToken(trevTokenAddress).initializeDAOContractOnTokenContract(address(this), valueOfEachVote);
    }    
  }

  event ProposalSubmitted (
    uint256 proposalID,
    bytes32 description,
    address proposer,
    uint256 deadline
    );

  event ProposalDefeated (
    uint256 proposalID,
    ProposalState state,
    string explanation
    );

  event ProposalSucceeded (
    uint256 proposalID,
    ProposalState state
    );

  event VoteSubmitted (
    address indexed voter,
    uint256 proposalID,
    bool support
    );

  event GovernorRoleAssigned (address indexed _governor);
  event VotingPeriodChanged (uint256 newVotingPeriod);
  event QuorumChanged (uint256 newQuorum);

  /**
    * Modifiers
  **/
  
  //only allows the governor address
  modifier onlyGovernor() {
    require(msg.sender == governor, "Only the governor can call this function");
    _;
  }

  /**
    * Viewing states of the TrevDAO Protocal
  **/

  //Returns values of each vote
  function valueOfEachProposalVote() external view returns (uint256)
  {
    return valueOfEachVote;
  }

  //Returns the name of the DAO protocal
  function name() external pure returns (string memory) {
    return "TrevDAO";
  }

  //Returns the version number of the DAO protocal
  function version() external pure returns (string memory) {
    return "1";
  }

  //Returns the state of a proposal
  function viewProposal(uint256 _proposalID) external view returns (Proposal memory) {
    Proposal memory proposal = proposals[_proposalID];
    return proposal;
  }  

  function seeBalenceOfContract() external view returns (uint256) {
    uint256 currentBalence = IERC20(trevTokenAddress).balanceOf(address(this));
    return currentBalence;
  }

  function proposalReachedDeadline(uint256 _proposalID) public view returns (bool) {
    Proposal memory proposal = proposals[_proposalID];

    if (block.timestamp > proposal.deadline) {
      return true;
    }

    return false;
  }

  /**
    * Voting functions:
  **/

  function voteAssignedToProposal(uint256 proposalID, bool support) internal {

    if (support) {
      uint256 totalVotesForProposal = votesForProposal[proposalID];
      votesForProposal[proposalID] = totalVotesForProposal + 1;
    }
    else {
      uint256 totalVotesAgainstProposal = votesAgainstProposal[proposalID];
      votesAgainstProposal[proposalID] = totalVotesAgainstProposal + 1;
    }       
  }

  function castVote(uint256 _proposalID, bool _support) external returns (bool) {
    address _sender = msg.sender;
    IERC20 token = IERC20(trevTokenAddress);
    require(ITrevToken(trevTokenAddress).getBlackListStatus(_sender) == false, "User is blacklisted from TTK");
    require(proposalReachedDeadline(_proposalID) == false, "Proposal voting period has expired");
    require(token.balanceOf(_sender) > 0, "Only TrevToken holders can participate");

    //token.approve(_sender, valueOfEachVote);
    token.transferFrom(_sender, address(this), valueOfEachVote);
    voteAssignedToProposal(_proposalID, _support);
    emit VoteSubmitted(_sender, _proposalID, _support);

    return true;
  }

  /**
    * Proposal functions:
  **/

  function submitProposal(bytes32 _description) external returns (bool success) {
    address proposer = msg.sender;

    require(ITrevToken(trevTokenAddress).getBlackListStatus(proposer) == false, "User is blacklisted from TTK");
    require(IERC20(trevTokenAddress).balanceOf(proposer) > 0, "Only TrevToken holders can participate");

    uint256 deadline = block.timestamp + votingPeriod;
    uint256 dateProposed = block.timestamp;

    stateOfProposal[proposalIDCounter] = ProposalState.Active;

    Proposal memory newProposal = Proposal(proposalIDCounter, _description, proposer, dateProposed, deadline);
    proposals.push(newProposal);

    proposalIDCounter++;

    emit ProposalSubmitted(newProposal.proposalID, newProposal.description, newProposal.proposer, newProposal.deadline);

    return true;
  }

  function checkProposalForDecision(uint256 _proposalID) external returns (bool proposalDecisionMade) {
    require(stateOfProposal[_proposalID] == ProposalState.Active, "Proposal is not active.");

    if (proposalReachedDeadline(_proposalID) == false) //still in voting period
    {
        return false;
    }

    uint256 votesFor = votesForProposal[_proposalID];
    uint256 votesAgainst = votesAgainstProposal[_proposalID];
    uint256 totalNumOfVotes = votesFor + votesAgainst; 

    if (totalNumOfVotes >= quorum) 
    {
        if (votesFor <= votesAgainst) 
        {
          stateOfProposal[_proposalID] = ProposalState.Defeated;
          emit ProposalDefeated(_proposalID, ProposalState.Defeated, "More votes against than for proposal.");
        }
        else if (votesFor > votesAgainst) 
        {
          stateOfProposal[_proposalID] = ProposalState.Suceeded;
          emit ProposalSucceeded(_proposalID, ProposalState.Suceeded);
        }
    }
    else 
    {
        stateOfProposal[_proposalID] = ProposalState.Defeated;
        emit ProposalDefeated(_proposalID, ProposalState.Defeated, "Proposal did not meet quorum.");
    }

    return true;
  }
    
  /**
    * Role assigning functions:
    * the governor of this DAO protocal can assign the executor role via setExecutor() and transfer
    * the governor role to another address via assignNewGoverner().
  **/

  function assignNewGovernor (address _governor) external onlyGovernor {
    governor = _governor;
    emit GovernorRoleAssigned(_governor);
  }

  function changeVotingPeriod (uint256 _votingPeriod) external onlyGovernor {
    votingPeriod = _votingPeriod;
    emit VotingPeriodChanged(_votingPeriod);
  }

  function changeQuorum (uint256 _quorum) external onlyGovernor {
    quorum = _quorum;
    emit QuorumChanged(_quorum);
  }  
}