import { IAppConfig, IBackendConfig, IChainConfig, IConnectWallet, IContracts } from '../types';

import { btcmtABI, presaleABI, stakingABI, usdtABI } from './abi';

// For production build, set flag to true
export const is_production = true;

// For production build, set flag to false
export const show_logs = false;
export const update_after_tx_timeout = 5000;

export const backend: IBackendConfig = {
  url: is_production ? 'https://minto.finance/api' : 'https://dev-minto.rocknblock.io/api',
};

export const chain: IChainConfig = {
  name: is_production ? 'Huobi ECO Chain Mainnet' : 'Huobi ECO Chain Testnet',
  id: is_production ? 128 : 256,
  rpc: is_production ? 'https://http-mainnet.hecochain.com' : 'https://http-testnet.hecochain.com',
  tx: {
    link: is_production ? 'https://hecoinfo.com/tx' : 'https://testnet.hecoinfo.com/tx',
  },
  nativeCurrency: {
    name: is_production ? 'HT' : 'HTT',
    symbol: is_production ? 'HT' : 'htt',
    decimals: 18,
  },
  blockExp: is_production ? 'https://hecoinfo.com' : 'https://testnet.hecoinfo.com',
};

export const connectWallet: IConnectWallet = {
  wallets: ['MetaMask', 'WalletConnect'],
  network: {
    name: chain.name,
    chainID: chain.id,
  },
  provider: {
    MetaMask: { name: 'MetaMask' },
    WalletConnect: {
      name: 'WalletConnect',
      useProvider: 'rpc',
      provider: {
        rpc: {
          rpc: {
            [chain.id]: chain.rpc,
          },
          chainId: chain.id,
        },
      },
    },
  },
  settings: { providerType: true },
};

export const config: IAppConfig = {
  menu: {
    open: {
      openConnectModal: true,
    },
    onlyForAuth: true,
  },
};

export const contracts: IContracts = {
  type: is_production ? 'mainnet' : 'testnet',
  names: ['Token', 'Staking', 'Presale', 'UsdtToken'],
  decimals: 18,
  params: {
    USDTTOKEN: {
      mainnet: {
        address: '0xa71EdC38d189767582C38A3145b5873052c3e47a',
        abi: usdtABI,
      },
      testnet: {
        address: '0xD561e2EC17108F5789571bF3f9DB3CcB0BC39683',
        abi: usdtABI,
      },
    },
    PRESALE: {
      mainnet: {
        address: '0x2b775b778f84b10877a41b78d6724634c7741827',
        abi: presaleABI,
      },
      testnet: {
        address: '0xF236E11BcA8480b360F1Ff21F45644d481379a14',
        abi: presaleABI,
      },
    },
    TOKEN: {
      mainnet: {
        address: '0x410a56541bD912F9B60943fcB344f1E3D6F09567',
        abi: btcmtABI,
      },
      testnet: {
        address: '0x4490aD12dEd69C082902800C35eCCD8f717Faf98',
        abi: btcmtABI,
      },
    },
    STAKING: {
      mainnet: {
        address: '0x78ae303182FCA96A4629A78Ee13235e6525EbcFb',
        abi: stakingABI,
      },
      testnet: {
        address: '0xCc6f88b04436211CB72f3B46d3d541642d77465C',
        abi: stakingABI,
      },
    },
  },
};
