import { ConnectWallet } from '@amfi/connect-wallet';
import Web3 from 'web3';

import { chain, connectWallet, contracts } from '../../config';
import { clogData, notify } from '../../utils';
import i18n from '../../utils/i18n';

export class WalletConnect {
  private connectWallet: any;

  constructor() {
    this.connectWallet = new ConnectWallet();
  }

  public async initWalletConnect(name: string): Promise<boolean> {
    const { provider, network, settings } = connectWallet;

    const connecting = this.connectWallet
      .connect(provider[name], network, settings)
      .then((connected: boolean) => {
        if (connected) {
          this.initializeContracts();
        }
        return connected;
      })
      .catch((err: any) => {
        clogData('initWalletConnect providerWallet err: ', err);
      });

    return Promise.all([connecting]).then((connect: any) => {
      return connect[0];
    });
  }

  public logOut(): void {
    this.connectWallet.resetConect();
  }

  public getContract(name: string): any {
    return this.connectWallet.Contract(name);
  }

  public Web3(): Web3 {
    return this.connectWallet.Web3Provider;
  }

  private initializeContracts(): void {
    contracts.names.forEach((name: string) => {
      const contract = contracts.params[name.toUpperCase()][contracts.type];

      this.connectWallet
        .addContract({
          name,
          abi: contract.abi,
          address: contract.address,
        })
        .then(() => clogData(`Contract ${name} added`, this.connectWallet.Contract(name)));
    });
  }

  public async getTokenBalance(address: string): Promise<string | number> {
    return this.connectWallet
      .Contract('Token')
      .methods.balanceOf(address)
      .call()
      .then((balance: string | number) => {
        clogData('user data: ', { address, balance });
        return balance;
      });
  }

  private async checkHekoNet() {
    const { connector, providerName } = this.connectWallet;
    if (providerName === 'MetaMask') {
      try {
        const resChain = await connector.connector.request({ method: 'eth_chainId' });

        if (connectWallet.network.chainID !== parseInt(resChain, 16)) {
          try {
            await connector.connector.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${connectWallet.network.chainID.toString(16)}` }],
            });
            return true;
          } catch (error: any) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (error.code === 4902) {
              try {
                await connector.connector.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: `0x${connectWallet.network.chainID.toString(16)}`,
                      chainName: connectWallet.network.name,
                      nativeCurrency: chain.nativeCurrency,
                      rpcUrls: [chain.rpc],
                      blockExplorerUrls: [chain.blockExp],
                    },
                  ],
                });
                try {
                  const newChain = await connector.connector.request({ method: 'eth_chainId' });

                  if (connectWallet.network.chainID !== parseInt(newChain, 16)) {
                    throw new Error('User reject switch network');
                  }
                } catch (err) {
                  throw new Error('get user chain');
                }

                return true;
              } catch (err) {
                throw new Error(`User reject add ${chain.name}`);
              }
            } else {
              throw new Error('User reject switch network');
            }
          }
        }
      } catch (err: any) {
        clogData('getAccount wallet connect - get user account err: ', err);
        throw new Error(err);
      }
    }
    return true;
  }

  public async getAccount(account: { address?: string; balance?: string }): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      this.checkHekoNet()
        .then(() => {
          this.connectWallet.getAccounts().subscribe(
            (userAccount: any) => {
              clogData('user account: ', userAccount);
              if (!account || userAccount.address !== account.address) {
                resolve(userAccount);
                notify(
                  `${i18n.t('notifications.wallet.connected')}: ${userAccount.address.substring(
                    0,
                    4,
                  )}...${userAccount.address.slice(
                    userAccount.address.length - 4,
                    userAccount.address.length,
                  )}`,
                  'success',
                );
              }
            },
            (err: any) => {
              clogData('getAccount wallet connect - get user account err: ', err);
              if (err.code && err.code === 6) {
                notify(`⚠️ User account disconnected!`, 'success');
                setTimeout(() => {
                  window.location.reload();
                }, 3000);
              } else {
                notify(
                  `⚠️ ${i18n.t('notifications.wallet.connected')}: $${err.message.text}`,
                  'error',
                );
              }
              reject(err);
            },
          );
        })
        .catch((err) => {
          notify(
            `⚠️ ${i18n.t('notifications.wallet.connected')}: $${err.message.text || err.message}`,
            'error',
          );
        });
    });
  }
}
