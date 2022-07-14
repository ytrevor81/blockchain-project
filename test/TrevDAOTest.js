const TrevToken = artifacts.require("TrevToken");
const TrevDAO = artifacts.require("TrevDAO");

contract("TrevDAO", (accounts) => {
  it ("deployed", async () => {
    const tokenInstance = await TrevToken.deployed();
    const tokenAddress = tokenInstance.address;
    const daoInstance = await TrevDAO.deployed(tokenAddress);
    const tokenAddressInDAO = await daoInstance.trevTokenAddress();
    assert.equal(tokenAddressInDAO, tokenAddress, "same address")
  });
});
