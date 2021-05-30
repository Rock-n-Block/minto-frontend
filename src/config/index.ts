interface IConfig {
  menu: {
    open: {
      openConnectModal: boolean;
    };
    onlyForAuth: boolean;
  };
  network?: {
    name: string;
    chainID: number;
  };
  connectWallet: {
    type?: string[];
    provider: {
      [index: string]: {};
    };
    settings?: {
      providerType?: boolean;
    };
  };
}
interface IContracts {
  decimals: number;
  names: string[];
  type: string;
  params: {
    [index: string]: {
      [index: string]: {
        address: string;
        abi: any[];
      };
    };
  };
}

export const is_production = false;

export const config: IConfig = {
  menu: {
    open: {
      openConnectModal: true,
    },
    onlyForAuth: true,
  },
  network: {
    // name: 'rinkeby',
    // chainID: 4,
    name: 'heco-testnet',
    chainID: 256,
    // name: 'heco',
    // chainID: 128,
  },
  connectWallet: {
    type: ['MetaMask', 'WalletConnect'],
    provider: {
      MetaMask: { name: 'MetaMask' },
      WalletConnect: {
        name: 'WalletConnect',
        use: 'provider',
        bridge: {
          url: 'https://bridge.walletconnect.org',
          infura: 'https://rinkeby.infura.io/v3/fcced28c4c894be791f39a8643431cf8',
        },
        provider: {
          infuraID: 'fcced28c4c894be791f39a8643431cf8',
        },
      },
    },
    settings: { providerType: true },
  },
};

export const contracts: IContracts = {
  decimals: 18,
  names: ['Token', 'Staking'],
  type: is_production ? 'mainnet' : 'testnet',
  params: {
    TOKEN: {
      mainnet: {
        address: '',
        abi: [],
      },
      testnet: {
        address: '0x7736dF4B9B4f09AF983eE2609Cc244e10B97EaF2',
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
            outputs: [],
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
        address: '',
        abi: [],
      },
      testnet: {
        address: '0x2574b09FA3074F83B8a79470b94c1c4AAA2b8e3A',
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
              { internalType: 'address', name: 'user', type: 'address' },
              { internalType: 'uint256', name: 'forDays', type: 'uint256' },
            ],
            name: '_calculationReward',
            outputs: [
              { internalType: 'uint256', name: '', type: 'uint256' },
              { internalType: 'uint256', name: '', type: 'uint256' },
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
            name: 'allTimeTotalStakers',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
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
            inputs: [{ internalType: 'uint256', name: 'forDays', type: 'uint256' }],
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