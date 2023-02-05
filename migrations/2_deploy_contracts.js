const BloodUnitTracker = artifacts.require("BloodUnitTracker");

module.exports = function (deployer) {
  deployer.deploy(BloodUnitTracker);
};
