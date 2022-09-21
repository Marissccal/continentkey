//require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("hardhat-deploy-ethers")
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

module.exports = {
  defaultNetwork: "rinkeby",
  networks: {
    hardhat: {
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/396bc7b74dec4a1bb894b416a9e3f07b",
      //accounts: [],
    }
  },
  etherscan: {
    apiKey: {
      rinkeby: 'PHCBEGD9USUQ45PTA4C6NJMTP6A76PU4D1',
    }
  },
  solidity: {
    version: "0.8.14",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
}