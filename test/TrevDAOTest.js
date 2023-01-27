const StringBytes32Helper = require( "../scripts/StringBytes32Helper.js");
const TrevToken = artifacts.require("TrevToken");
const TrevDAO = artifacts.require("TrevDAO");

contract("TrevDAO", (accounts) => {
  let daoInstance;
  let daoAddress;
  let tokenInstance;
  let tokenAddress;
  const mainAccount = accounts[0];
  const stringBytes32Helper = new StringBytes32Helper();

  const proposalTest = "Hello World!!!";
  let proposalID;
  let bytes32ProposalDescription;

  const proposalActiveEnum = 0;
  const proposalDefeatedEnum = 1;
  const proposalSucceededEnum = 2;


  it ("deployed", async () => {
    tokenInstance = await TrevToken.deployed();
    tokenAddress = tokenInstance.address;
    daoInstance = await TrevDAO.deployed(tokenAddress);

    const tokenAddressInDAO = await daoInstance.trevTokenAddress();
    assert.equal(tokenAddressInDAO, tokenAddress, "dao contract ready")

    daoAddress = daoInstance.address;
    const daoAddressInTokenContract = await tokenInstance.viewDAOAddress();
    assert.equal(daoAddressInTokenContract, daoAddress, "dao address assigned in token contract");
  });
  
  it ("dao proposal submitted", async () => {
    bytes32ProposalDescription = stringBytes32Helper.stringToBytes32(proposalTest);
    const submittedProposalResult = await daoInstance.submitProposal(bytes32ProposalDescription);
    proposalID = submittedProposalResult.logs[0].args.proposalID;
    const bytes32DescriptionFromContract = submittedProposalResult.logs[0].args.description;

    assert.equal(proposalID, 0, "Proposal ID equal to expected ID num");
    assert.equal(bytes32DescriptionFromContract, bytes32ProposalDescription, "Bytes32 description in contract expected");
    
    const translatedContractDescription = stringBytes32Helper.bytes32ToString(bytes32DescriptionFromContract);
    assert.equal(translatedContractDescription, proposalTest, "String description in contract expected");

    const proposalInfo = await daoInstance.viewProposal(proposalID);

    assert.equal(proposalInfo.proposalID, proposalID, "Correct proposal viewed");
    assert.equal(proposalInfo.description, bytes32ProposalDescription, "Bytes32 description is correct");
    assert.equal(proposalInfo.proposer, mainAccount, "Proposer is correct address");
    assert.equal(stringBytes32Helper.bytes32ToString(proposalInfo.description), translatedContractDescription, "String description is correct");
  });

  it ("vote cast", async () => {
    const approveTokenTransferForVote = await tokenInstance.approveForDAOVote();
    const approvalEvent = approveTokenTransferForVote.logs[0].args;
    assert.equal(approvalEvent.owner, mainAccount, "transfer to dao approved");
    assert.equal(approvalEvent.spender, daoAddress, "transfer to dao approved");

    let votesForProposal = await daoInstance.votesForProposal(proposalID);
    assert.notEqual(votesForProposal, 1, "votes should be 0");

    const castVoteForProposal = await daoInstance.castVote(proposalID, true);
    const castVoteEvent = castVoteForProposal.logs[0].args;
    assert.equal(castVoteEvent.proposalID, 0, "correct proposal ID");
    assert.equal(castVoteEvent.support, true, "recorded votes for proposal");

    votesForProposal = await daoInstance.votesForProposal(proposalID);
    assert.equal(votesForProposal, 1, "vote confirmed for proposal");
  });
});
