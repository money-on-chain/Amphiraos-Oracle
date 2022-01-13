
const networks = {
    hardhat: {
      live: false,
      allowUnlimitedContractSize: true,
      chainId: 31337,
      tags: ["test", "local"],
    },
    ganache: {
      url: 'http://127.0.0.1:8545',
      blockGasLimit: 200000000,
      allowUnlimitedContractSize: false,
      chainId: 1337
    },
  }
  
  if (process.env.HDWALLET_MNEMONIC) {
    networks.polygonTestnet =  {
      live: true,
      url: 'https://rpc-mumbai.maticvigil.com/v1/be1491119b4feffcdaa148c89da6f43895bb1dd4',
      chainId: 80001,
      allowUnlimitedContractSize: false,
      gasPrice: 70000000000,
      accounts:{
        mnemonic: process.env.HDWALLET_MNEMONIC
      },
      tags: ["staging"]
    }
  } else {
    console.warn('No hdwallet available for testnet and mainnet')
  }
module.exports = networks