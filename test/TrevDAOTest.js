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
});
