import { IAppConfig, IBackendConfig, IChainConfig, IConnectWallet, IContracts } from '../types';

import { btcmtABI, presaleABI, stakingABI, usdtABI } from './abi';

export const is_production = false;

export const show_logs = true;
export const update_after_tx_timeout = 5000;

export const backend: IBackendConfig = {
  url: is_production ? '/api' : '/api',
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
        address: '0xcdf7513524d4e481f2c53a02adfbe16993537950',
        abi: presaleABI,
      },
    },
    TOKEN: {
      mainnet: {
        address: '0x410a56541bD912F9B60943fcB344f1E3D6F09567',
        abi: btcmtABI,
      },
      testnet: {
        address: '0x3d501a7176edebc51b6a155f83821f4b45f88cd0',
        abi: btcmtABI,
      },
    },
    STAKING: {
      mainnet: {
        address: '0x9Cad4215FD0fc460B042eC86AbDe0130aA77069E',
        abi: stakingABI,
      },
      testnet: {
        address: '0x0C992f08dDC5ea8DbD8AC59113C64f7B08a91Bd0',
        abi: stakingABI,
      },
    },
  },
};
