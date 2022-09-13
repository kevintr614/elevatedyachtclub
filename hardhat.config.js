require('dotenv').config()
require('@nomiclabs/hardhat-waffle')

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: '0.8.16',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  defaultNetwork: 'rinkeby',
  networks: {
    hardhat: {},
    rinkeby: {
      url: `${process.env.PUBLIC_ALCHEMY_RPC_URL}`,
      accounts: [`c969cb39197a4d6c264e6b6e1d7d3fa4dbbbbe6d13d93ecfa58937f1ac3bd516`]
    }
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts'
  },
  mocha: {
    timeout: 40000
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_API_KEY}`
  }
}
