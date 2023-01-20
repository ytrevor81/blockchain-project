import StringBytes32Helper from "../scripts/StringBytes32Helper";
const TrevToken = artifacts.require("TrevToken");
const TrevDAO = artifacts.require("TrevDAO");

contract("TrevDAO", (accounts) => {
  let daoInstance;
  let daoAddress;
  let tokenInstance;
  let tokenAddress;
  const mainAccount = accounts[0];
  const stringBytes32Helper = new StringBytes32Helper();

  it ("deployed", async () => {
    tokenInstance = await TrevToken.deployed();
    tokenAddress = tokenInstance.address;
    daoInstance = await TrevDAO.deployed(tokenAddress);

    const tokenAddressInDAO = await daoInstance.trevTokenAddress();
    assert.equal(tokenAddressInDAO, tokenAddress, "dao contract ready")
  });


  it ("making a proposal", async () => {
    daoAddress = daoInstance.address;  
    
    //still in progress
  });
});
