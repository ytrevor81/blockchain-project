const TrevToken = artifacts.require("TrevToken")

contract("TrevToken", (accounts) => {

  const mainAccount = accounts[0];
  const receivingAccount = accounts[1];
  let totalAmountReceived;

  it ("successful transfer", async () => {
    const contractInstance = await TrevToken.deployed();
    const balanceOfMainAccount = await contractInstance.balanceOf(mainAccount);
    const totalSupply = await contractInstance.totalSupply();
    assert.equal(BigInt(balanceOfMainAccount), BigInt(totalSupply), "same balance");

    totalAmountReceived = 1000;
    const success = await contractInstance.transfer.call(receivingAccount, totalAmountReceived, { from: mainAccount });
    assert.equal(success, true, 'transfer is valid');
    const eventData =  await contractInstance.transfer(receivingAccount, totalAmountReceived, { from: mainAccount });
    assert.equal(eventData.logs[0].args.value.toNumber(), totalAmountReceived, 'logs the transfer amount');
    const balanceOfReceiver = await contractInstance.balanceOf(receivingAccount);
    assert.equal(balanceOfReceiver.toNumber(), totalAmountReceived, "receiving account has expected amount of tokens");
  });

  it ("successfully added to and removed from blacklist", async () => {
    const contractInstance = await TrevToken.deployed();
    const newAmount = 10000
    totalAmountReceived += newAmount;
    const addedToBlackListData = await contractInstance.addToBlackList(receivingAccount);
    assert.equal(addedToBlackListData.logs[0].args._user, receivingAccount, "address on blacklist");

    let isBlackListed = await contractInstance.getBlackListStatus(receivingAccount);
    assert.equal(isBlackListed, true, "confirmed address is on blacklist");

    let failedTransfer;

    try {
      failedTransfer = await contractInstance.transfer.call(receivingAccount, newAmount, { from: mainAccount });
    }
    catch(err) {
      failedTransfer = false;
    }
    finally {
      assert.equal(failedTransfer, false, "confirmed address is on blacklist");
    }

    const removedFromBlackListData = await contractInstance.removeFromBlackList(receivingAccount);
    assert.equal(addedToBlackListData.logs[0].args._user, receivingAccount, "address removed from blacklist");

    isBlackListed = await contractInstance.getBlackListStatus(receivingAccount);
    assert.equal(isBlackListed, false, "confirmed address is removed from blacklist");

    const eventData =  await contractInstance.transfer(receivingAccount, newAmount, { from: mainAccount });
    assert.equal(eventData.logs[0].args.value.toNumber(), newAmount, 'logs the transfer amount');

    const balanceOfFormerBlacklistee = await contractInstance.balanceOf(receivingAccount);
    assert.equal(balanceOfFormerBlacklistee.toNumber(), totalAmountReceived, "receiving account has expected amount of tokens");

  });
});
