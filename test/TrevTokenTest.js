const TrevToken = artifacts.require("TrevToken")

contract("TrevToken", (accounts) => {
  it ("deployed", async () => {
    let contractInstance = await TrevToken.deployed();
    let name = await contractInstance.name();
    assert.equal(name, "Trev Token", "not the same name")
  });

  it ("successful transfer", async () => {
    let contractInstance = await TrevToken.deployed();
    let mainAccount = accounts[0];
    let receivingAccount = accounts[1];
    let balanceOfMainAccount = await contractInstance.balanceOf(mainAccount);
    let totalSupply = await contractInstance.totalSupply();
    assert.equal(BigInt(balanceOfMainAccount), BigInt(totalSupply), "not the same balance");

    let amount = 1000;
    let complete = await contractInstance.transfer.call(receivingAccount, amount, { from: mainAccount });
    let balanceOfReceiver = await contractInstance.balanceOf(receivingAccount);
    assert.equal(balanceOfReceiver.toNumber(), amount, "transfer complete");
  });

  it ("successful add to blacklist", async () => {
    let contractInstance = await TrevToken.deployed();
    let blackListedAccount = accounts[1];
    await contractInstance.addToBlackList(blackListedAccount);
    let isBlackListed = await contractInstance.getBlackListedStatus(blackListedAccount);
    assert.equal(isBlackListed, true, "address not blacklisted");
  });
});
