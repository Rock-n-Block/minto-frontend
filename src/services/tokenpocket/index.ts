import { ConnectWallet } from '@amfi/connect-wallet';
import Web3 from 'web3';

import { config, contracts } from '../../config';
import { clogData, notify } from '../../utils';
import i18n from '../../utils/i18n';

export class TokenPocket {
  private connectWallet: any;

  constructor() {
    this.connectWallet = new ConnectWallet();
  }

  public async initWalletConnect(name: string): Promise<boolean> {
    const {
      connectWallet: { provider, settings },
      network,
    } = config;

    clogData('network: ', network);

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

  public getAccount(account: { address?: string; balance?: string }): Promise<any> {
    return new Promise((resolve: any, reject) => {
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
          clogData('wallet connect - get user account: ', err);
          notify(`⚠️ ${i18n.t('notifications.wallet.connected')}: $${err.message.text}`, 'error');
          reject(err);
        },
      );
    });
  }
}
