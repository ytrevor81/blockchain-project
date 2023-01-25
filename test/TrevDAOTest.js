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
  const amountOfTrevTokenVote = 1;

  const proposalTest = "Hello World!!!";
  let proposalID;
  let bytes32ProposalDescription;

  it ("deployed", async () => {
    tokenInstance = await TrevToken.deployed();
    tokenAddress = tokenInstance.address;
    daoInstance = await TrevDAO.deployed(tokenAddress);

    const tokenAddressInDAO = await daoInstance.trevTokenAddress();
    assert.equal(tokenAddressInDAO, tokenAddress, "dao contract ready")
  });


  it ("dao address assigned in token contract", async () => {
    daoAddress = daoInstance.address;  
    const daoAddedToERC20 = await tokenInstance.addDAOAddress(daoAddress);
    assert.equal(daoAddedToERC20.logs[0].args._daoAddress, daoAddress, "address is in Trev Token");
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
});
