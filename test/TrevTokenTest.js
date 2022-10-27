const TrevToken = artifacts.require("TrevToken")

contract("TrevToken", (accounts) => {
  it ("successful transfer", async () => {
    const contractInstance = await TrevToken.deployed();
    const mainAccount = accounts[0];
    const receivingAccount = accounts[1];
    const balanceOfMainAccount = await contractInstance.balanceOf(mainAccount);
    const totalSupply = await contractInstance.totalSupply();
    assert.equal(BigInt(balanceOfMainAccount), BigInt(totalSupply), "not the same balance");

    const amount = 1000;
    const success = await contractInstance.transfer.call(receivingAccount, amount, { from: mainAccount });
    assert.equal(success, true, 'transfer is valid');
    const eventData =  await contractInstance.transfer(receivingAccount, amount, { from: mainAccount });
    assert.equal(eventData.logs[0].args.value.toNumber(), amount, 'logs the transfer amount');
    const balanceOfReceiver = await contractInstance.balanceOf(receivingAccount);
    assert.equal(balanceOfReceiver.toNumber(), amount, "receiving account has expected amount of tokens");
  });

  it ("successful add to blacklist", async () => {
    let contractInstance = await TrevToken.deployed();
    let blackListedAccount = accounts[1];
    // await contractInstance.addToBlackList(blackListedAccount); //should return bool
    // let isBlackListed = await contractInstance.getBlackListedStatus(blackListedAccount);
    // assert.equal(isBlackListed, true, "address not blacklisted");
  });
});
