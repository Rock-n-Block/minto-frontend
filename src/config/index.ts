export const config = {
  mode: 'prod',
  blockchain: {
    chain: {
      id: 4,
      name: 'ropsten',
    },
  },
  menu: {
    open: {
      onlyForAuth: true,
      openConnectModal: true,
    },
  },
  connectWallet: {
    type: ['Metamask', 'WalletConnect'],
    walletConnect: {
      wallets: ['TokenPocket'],
    },
  },
};
