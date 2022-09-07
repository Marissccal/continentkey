import 'dotenv/config';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@typechain/hardhat';
import '@typechain/hardhat/dist/type-extensions';
import { removeConsoleLog } from 'hardhat-preprocessor';
import 'hardhat-gas-reporter';
import 'hardhat-deploy';
import 'solidity-coverage';
import { HardhatUserConfig, MultiSolcUserConfig, NetworksUserConfig } from 'hardhat/types';
import * as env from './utils/env';
import 'tsconfig-paths/register';

const networks: NetworksUserConfig =
process.env.TEST || env.isHardhatCompile() || env.isHardhatClean() || env.isTesting()
    ? {}
    : {
        hardhat: {
          forking: {
            enabled: process.env.FORK ? true : false,
            url: process.env.RPC_ROPSTEN as string,
          },
        },
        ropsten: {
          url: process.env.RPC_ROPSTEN,
          accounts: [process.env.PRIVATE_KEY_ROPSTEN as string],
        },
        goerli: {
          url: process.env.RPC_GOERLI,
          accounts: [process.env.PRIVATE_KEY_GOERLI as string],
        },
        rinkeby: {
          url: process.env.RPC_RINKEBY,
          accounts: [process.env.PRIVATE_KEY_RINKEBY as string],
        },
        bsctestnet: {
          url: process.env.RPC_BSCTESTNET,
          accounts: [process.env.PRIVATE_KEY_BSCTESTNET as string],
        },
        bsc: {
          url: process.env.RPC_BSC,
          accounts: [process.env.PRIVATE_KEY_BSC as string],
        },
        polygon: {
          url: process.env.RPC_POLYGON,
          accounts: [process.env.PRIVATE_KEY_POLYGON as string],
        },
        kovan: {
          url: env.getNodeUrl('kovan'),
          accounts: env.getAccounts('kovan'),
        },
        ethereum: {
          url: env.getNodeUrl('ethereum'),
          accounts: env.getAccounts('ethereum'),
        },
      };

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  mocha: {
    timeout: process.env.MOCHA_TIMEOUT || 300000,
  },
  networks,
  solidity: {
    compilers: [
      {
        version: '0.8.14',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.8.10',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.8.0',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.7.4',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.6.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.6.2',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  gasReporter: {
    currency: process.env.COINMARKETCAP_DEFAULT_CURRENCY || 'USD',
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    //enabled: process.env.REPORT_GAS ? true : false,
    showMethodSig: true,
    onlyCalledMethods: false,
  },
  preprocess: {
    eachLine: removeConsoleLog((hre) => hre.network.name !== 'hardhat'),
  },
  etherscan: {    
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      rinkeby: 'PHCBEGD9USUQ45PTA4C6NJMTP6A76PU4D1',
      ropsten: 'PHCBEGD9USUQ45PTA4C6NJMTP6A76PU4D1',
      goerli: 'PHCBEGD9USUQ45PTA4C6NJMTP6A76PU4D1',
      polygon: process.env.POLYGON_API_KEY,
      polygonMumbai: process.env.POLYGON_API_KEY,
      bsc: process.env.BSCSACN_API_KEY,
      bscTestnet: process.env.BSCSACN_API_KEY,
    }
  },
  typechain: {
    outDir: 'typechained',
    target: 'ethers-v5',
  },
  paths: {
    sources: './solidity',
  },
};

if (process.env.TEST) {
  (config.solidity as MultiSolcUserConfig).compilers = (config.solidity as MultiSolcUserConfig).compilers.map((compiler) => {
    return {
      ...compiler,
      outputSelection: {
        '*': {
          '*': ['storageLayout'],
        },
      },
    };
  });
}

export default config;
