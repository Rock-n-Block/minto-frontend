import { IAppConfig, IBackendConfig, IChainConfig, IConnectWallet, IContracts } from '../types';

import { btcmtABI, presaleABI, stakingABI, usdtABI } from './abi';

export const is_production = false;

export const show_logs = true;
export const update_after_tx_timeout = 5000;

export const backend: IBackendConfig = {
  url: process.env.NODE_ENV === 'development' ? '/api' : 'https://dev-minto.rocknblock.io/api',
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
        address: '0xc0643C8a5E16981F88Cde1518a377445aED9498D',
        abi: presaleABI,
      },
      testnet: {
        address: '0x96D1759A3994BDC46dA1D41A3Dfc34264613b82f',
        abi: presaleABI,
      },
    },
    TOKEN: {
      mainnet: {
        address: '0x410a56541bD912F9B60943fcB344f1E3D6F09567',
        abi: btcmtABI,
      },
      testnet: {
        address: '0xCAD5071C92A0a1BE73EFCc10736456F7f3464B34',
        abi: btcmtABI,
      },
    },
    STAKING: {
      mainnet: {
        address: '0x9Cad4215FD0fc460B042eC86AbDe0130aA77069E',
        abi: stakingABI,
      },
      testnet: {
        address: '0x892fdeaB3ca1b31d68bf03eeb5ef8AEB2f91D794',
        abi: stakingABI,
      },
    },
  },
};
