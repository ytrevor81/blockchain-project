const TrevNFT = artifacts.require("./TrevNFT.sol");

module.exports = function (deployer) {
  var maximumNumOfNFTs = 50;
  deployer.deploy(TrevNFT, maximumNumOfNFTs);
};
