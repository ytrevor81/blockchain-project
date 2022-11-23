const TrevToken = artifacts.require("TrevToken");
const TrevDAO = artifacts.require("TrevDAO");

contract("TrevDAO", (accounts) => {
  let daoInstance;
  let tokenInstance;
  const mainAccount = accounts[0];
  const receivingAccount = accounts[1];

  it ("deployed", async () => {
    tokenInstance = await TrevToken.deployed();
    const tokenAddress = tokenInstance.address;
    daoInstance = await TrevDAO.deployed(tokenAddress);

    const tokenAddressInDAO = await daoInstance.trevTokenAddress();
    assert.equal(tokenAddressInDAO, tokenAddress, "dao contract ready")
  });


  // it ("deployed", async () => {
  //   tokenInstance = await TrevToken.deployed();
  //   const tokenAddress = tokenInstance.address;
  //   daoInstance = await TrevDAO.deployed(tokenAddress);
  //
  //   const tokenAddressInDAO = await daoInstance.trevTokenAddress();
  //   assert.equal(tokenAddressInDAO, tokenAddress, "dao contract ready")
  // });
});
