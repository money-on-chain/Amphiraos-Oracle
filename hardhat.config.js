require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-ethers");
require('hardhat-deploy');

const networks = require('./hardhat.networks');
const namedAccounts = require('./hardhat.accounts');

module.exports = {
  defaultNetwork: "hardhat",
  networks,
  solidity: {
    compilers: [
      {
        version: "0.4.23",
        settings:{
          optimizer: {
            enabled: true,
            runs: 999999
          }
        },
      },
      {
        version: "0.4.13",
        settings:{
          optimizer: {
            enabled: true,
            runs: 999999
          }
        },
      },
      {
        version: "0.4.24",
        settings:{
          optimizer: {
            enabled: true,
            runs: 999999
          }
        },
      },

    ],
  },
  paths:{
    sources: './contracts',
    cache: './cache',
    artifacts: './build',
  },
  namedAccounts,
  mocha:{
    timeout: 100000,
  }
};

