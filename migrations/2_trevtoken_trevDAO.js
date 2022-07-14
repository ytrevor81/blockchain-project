const TrevToken = artifacts.require("./TrevToken.sol");
const TrevDao = artifacts.require("./TrevDAO.sol");

module.exports = function (deployer) {
  deployer.deploy(TrevToken).then(function() {
    return deployer.deploy(TrevDao, TrevToken.address);
  });  
};
