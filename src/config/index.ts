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
        address: '0x6330d4DE28D1951a1E4F0bb24A4769fa73227eBF',
        abi: [
          {
            inputs: [
              { internalType: 'address', name: '_BTCMT', type: 'address' },
              { internalType: 'address', name: '_USDT', type: 'address' },
              { internalType: 'uint256', name: '_capToSell', type: 'uint256' },
              { internalType: 'uint256', name: '_USDT_DECIMALS', type: 'uint256' },
            ],
            stateMutability: 'nonpayable',
            type: 'constructor',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
              { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
            ],
            name: 'OwnershipTransferred',
            type: 'event',
          },
          {
            inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            name: 'BONUS_BREAKPOINTS',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            name: 'BONUS_PERCENTAGES',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'BTCMT',
            outputs: [{ internalType: 'contract IBTCMTForPresale', name: '', type: 'address' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'USDT',
            outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'USDT_DECIMALS_MINUS_ONE',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
              { internalType: 'uint256', name: 'timeInWeeks', type: 'uint256' },
            ],
            name: 'buy',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [],
            name: 'capToSell',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'owner',
            outputs: [{ internalType: 'address', name: '', type: 'address' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'renounceOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'uint256', name: '_capToSell', type: 'uint256' }],
            name: 'setCapToSell',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [],
            name: 'totalSold',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
            name: 'transferOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
      },
    },
    TOKEN: {
      mainnet: {
        address: '0x410a56541bD912F9B60943fcB344f1E3D6F09567',
        abi: btcmtABI,
      },
      testnet: {
        address: '0x4490aD12dEd69C082902800C35eCCD8f717Faf98',
        abi: [
          { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
          {
            anonymous: false,
            inputs: [
              { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
              { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
              { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
            ],
            name: 'Approval',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
              { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
              { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'ApprovalLocked',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: true, internalType: 'address', name: 'farm', type: 'address' },
              { indexed: false, internalType: 'bool', name: 'isFarmNow', type: 'bool' },
            ],
            name: 'FarmStatusChanged',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
              {
                indexed: true,
                internalType: 'bytes32',
                name: 'previousAdminRole',
                type: 'bytes32',
              },
              { indexed: true, internalType: 'bytes32', name: 'newAdminRole', type: 'bytes32' },
            ],
            name: 'RoleAdminChanged',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
              { indexed: true, internalType: 'address', name: 'account', type: 'address' },
              { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
            ],
            name: 'RoleGranted',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
              { indexed: true, internalType: 'address', name: 'account', type: 'address' },
              { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
            ],
            name: 'RoleRevoked',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: true, internalType: 'address', name: 'from', type: 'address' },
              { indexed: true, internalType: 'address', name: 'to', type: 'address' },
              { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
            ],
            name: 'Transfer',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: true, internalType: 'address', name: 'from', type: 'address' },
              { indexed: true, internalType: 'address', name: 'to', type: 'address' },
              { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'TransferLocked',
            type: 'event',
          },
          {
            inputs: [],
            name: 'DEFAULT_ADMIN_ROLE',
            outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'MINTER_ROLE',
            outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: 'farm', type: 'address' }],
            name: 'addFarm',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: '', type: 'address' },
              { internalType: 'uint256', name: '', type: 'uint256' },
            ],
            name: 'allMints',
            outputs: [
              { internalType: 'uint256', name: 'time', type: 'uint256' },
              { internalType: 'uint256', name: 'total', type: 'uint256' },
              { internalType: 'uint256', name: 'alreadyUnlocked', type: 'uint256' },
              { internalType: 'uint256', name: 'transferredAsLocked', type: 'uint256' },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
            name: 'allMintsLength',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'owner', type: 'address' },
              { internalType: 'address', name: 'spender', type: 'address' },
            ],
            name: 'allowance',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'spender', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'approve',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'to', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'approveLocked',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
            name: 'balanceOf',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
            name: 'balanceOfLocked',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
            name: 'balanceOfSum',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
            name: 'burn',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'account', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'burnFrom',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'from', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'burnFromLocked',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
            name: 'burnLocked',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [],
            name: 'decimals',
            outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'spender', type: 'address' },
              { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
            ],
            name: 'decreaseAllowance',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'to', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'decreaseLockedAllowance',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
            name: 'getRoleAdmin',
            outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'bytes32', name: 'role', type: 'bytes32' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            name: 'grantRole',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'bytes32', name: 'role', type: 'bytes32' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            name: 'hasRole',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'spender', type: 'address' },
              { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
            ],
            name: 'increaseAllowance',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'to', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'increaseLockedAllowance',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: '', type: 'address' }],
            name: 'index',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: '', type: 'address' },
              { internalType: 'address', name: '', type: 'address' },
            ],
            name: 'lockedAllowances',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'to', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
              { internalType: 'uint256', name: 'timeInWeeks', type: 'uint256' },
            ],
            name: 'mintLocked',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [],
            name: 'name',
            outputs: [{ internalType: 'string', name: '', type: 'string' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: 'farm', type: 'address' }],
            name: 'removeFarm',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'bytes32', name: 'role', type: 'bytes32' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            name: 'renounceRole',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'bytes32', name: 'role', type: 'bytes32' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            name: 'revokeRole',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
            name: 'supportsInterface',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'symbol',
            outputs: [{ internalType: 'string', name: '', type: 'string' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'totalSupply',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'recipient', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'transfer',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'to', type: 'address' },
              { internalType: 'uint256', name: 'amountLocked', type: 'uint256' },
              { internalType: 'uint256', name: 'amountUnlocked', type: 'uint256' },
              { internalType: 'uint256[]', name: 'farmIndexes', type: 'uint256[]' },
            ],
            name: 'transferFarm',
            outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'sender', type: 'address' },
              { internalType: 'address', name: 'recipient', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'transferFrom',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'from', type: 'address' },
              { internalType: 'uint256', name: 'amountLocked', type: 'uint256' },
              { internalType: 'uint256', name: 'amountUnlocked', type: 'uint256' },
            ],
            name: 'transferFromFarm',
            outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'from', type: 'address' },
              { internalType: 'address', name: 'to', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'transferFromLocked',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'to', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'transferLocked',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'who', type: 'address' },
              { internalType: 'uint256', name: 'numberOfBlocks', type: 'uint256' },
            ],
            name: 'unlock',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
      },
    },
    STAKING: {
      mainnet: {
        address: '0x9Cad4215FD0fc460B042eC86AbDe0130aA77069E',
        abi: stakingABI,
      },
      testnet: {
        address: '0xCc6f88b04436211CB72f3B46d3d541642d77465C',
        abi: [
          {
            inputs: [
              { internalType: 'contract IBTCMT', name: '_SToken', type: 'address' },
              { internalType: 'contract IERC20', name: '_rewardToken', type: 'address' },
              { internalType: 'uint256', name: 'miniStakePeriod', type: 'uint256' },
              { internalType: 'uint256', name: 'startTime', type: 'uint256' },
            ],
            stateMutability: 'nonpayable',
            type: 'constructor',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
              { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
            ],
            name: 'OwnershipTransferred',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: false, internalType: 'address', name: 'who', type: 'address' },
              { indexed: false, internalType: 'uint256', name: 'day', type: 'uint256' },
              { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
              {
                indexed: false,
                internalType: 'uint256',
                name: 'totalRewardOnContract',
                type: 'uint256',
              },
            ],
            name: 'RewardDeposit',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: false, internalType: 'address', name: 'who', type: 'address' },
              { indexed: false, internalType: 'uint256', name: 'day', type: 'uint256' },
              { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
              {
                indexed: false,
                internalType: 'uint256',
                name: 'totalRewardOnContract',
                type: 'uint256',
              },
            ],
            name: 'RewardWithdrawn',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: false, internalType: 'address', name: 'who', type: 'address' },
              { indexed: false, internalType: 'uint256', name: 'day', type: 'uint256' },
              { indexed: false, internalType: 'uint256', name: 'amountLocked', type: 'uint256' },
              { indexed: false, internalType: 'uint256', name: 'amountUnlocked', type: 'uint256' },
              { indexed: false, internalType: 'uint256', name: 'totalAmount', type: 'uint256' },
            ],
            name: 'StakeTokenIncome',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: false, internalType: 'address', name: 'who', type: 'address' },
              { indexed: false, internalType: 'uint256', name: 'day', type: 'uint256' },
              { indexed: false, internalType: 'uint256', name: 'amountLocked', type: 'uint256' },
              { indexed: false, internalType: 'uint256', name: 'amountUnlocked', type: 'uint256' },
              { indexed: false, internalType: 'uint256', name: 'totalAmount', type: 'uint256' },
            ],
            name: 'StakeTokenOutcome',
            type: 'event',
          },
          {
            inputs: [
              { internalType: 'address', name: '', type: 'address' },
              { internalType: 'uint256', name: '', type: 'uint256' },
            ],
            name: '_stakesDays',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: '', type: 'address' },
              { internalType: 'uint256', name: '', type: 'uint256' },
            ],
            name: '_unstakesDays',
            outputs: [
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
              { internalType: 'bool', name: 'before', type: 'bool' },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'allTimeTotalMined',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'allTimeTotalStaked',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'allTimeTotalStakers',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'user', type: 'address' },
              { internalType: 'uint256', name: 'startDay', type: 'uint256' },
              { internalType: 'uint256', name: 'endDay', type: 'uint256' },
            ],
            name: 'calculationRewardTable',
            outputs: [{ internalType: 'uint256[]', name: 'arr', type: 'uint256[]' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'currentDay',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'farmStartedTime',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
            name: 'getCurrentUserReward',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'getTodayReward',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'miniStakePeriodInSeconds',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'nowTotalMined',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'nowTotalStakers',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'owner',
            outputs: [{ internalType: 'address', name: '', type: 'address' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'renounceOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            name: 'rewardDeposits',
            outputs: [
              { internalType: 'uint256', name: 'amountOfReward', type: 'uint256' },
              { internalType: 'uint256', name: 'amountOfShairsNow', type: 'uint256' },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'rewardToken',
            outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
            name: 'rewardTokenDonation',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [],
            name: 'stakeEnd',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'uint256', name: 'lockedAmount', type: 'uint256' },
              { internalType: 'uint256', name: 'unlockedAmount', type: 'uint256' },
            ],
            name: 'stakeEndPartially',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'uint256', name: 'amountUnlocked', type: 'uint256' },
              { internalType: 'uint256', name: 'amountLocked', type: 'uint256' },
            ],
            name: 'stakeStart',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [],
            name: 'stoken',
            outputs: [{ internalType: 'contract IBTCMT', name: '', type: 'address' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'totalRewardInPool',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'totalWithdrawed',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
            name: 'transferOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: '', type: 'address' }],
            name: 'userStakes',
            outputs: [
              { internalType: 'uint256', name: 'day', type: 'uint256' },
              { internalType: 'uint256', name: 'totalAmount', type: 'uint256' },
              { internalType: 'uint256', name: 'lockedAmount', type: 'uint256' },
              { internalType: 'uint256', name: 'unlockedAmount', type: 'uint256' },
              { internalType: 'uint256', name: 'previousAmount', type: 'uint256' },
              { internalType: 'uint256', name: 'reservedReward', type: 'uint256' },
              { internalType: 'uint256', name: 'claimedDay', type: 'uint256' },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'withdrawRewardAll',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
            name: 'withdrawRewardPartially',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
      },
    },
  },
};
