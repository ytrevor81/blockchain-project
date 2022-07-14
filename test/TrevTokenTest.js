const TrevToken = artifacts.require("TrevToken")

contract("TrevToken", (accounts) => {
  it ("deployed", async () => {
    const contractInstance = await TrevToken.deployed();
    const name = await contractInstance.name();
    assert.equal(name, "Trev Token", "not the same name")
  });

  it ("successful transfer", async () => {
    const contractInstance = await TrevToken.deployed();
    const mainAccount = accounts[0];
    const receivingAccount = accounts[1];
    const balanceOfMainAccount = await contractInstance.getBalance(mainAccount).toNumber();
    const totalSupply = await contractInstance.totalSupply().toNumber();
    assert.equal(balanceOfMainAccount, totalSupply, "not the same balance");

    const amount = 1000;
    await contractInstance.transfer.call(receivingAccount, amount, { from: mainAccount });
    const balanceOfReceiver = await contractInstance.getBalance(receivingAccount).toNumber();
    assert.equal(balanceOfReceiver, amount, "transfer complete");
  });

  it ("successful add to blacklist", async () => {
    const contractInstance = await TrevToken.deployed();
    const blackListedAccount = accounts[1];
    await contractInstance.addToBlackList(blackListedAccount);
    const isBlackListed = await contractInstance.getBlackListedStatus(blackListedAccount);
    assert.equal(isBlackListed, true, "address not blacklisted");
  });
});
