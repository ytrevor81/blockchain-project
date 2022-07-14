const TrevToken = artifacts.require("TrevToken")

contract("TrevToken", (accounts) => {
  it ("deployed", async () => {
    const contractInstance = await TrevToken.deployed();
    const name = await contractInstance.name();
    assert.equal(name, "Trev Token", "same name")
  });
});
