import { ConnectWallet } from '@amfi/connect-wallet';
import Web3 from 'web3';

import { connectWallet, contracts } from '../../config';
import { clogData, notify } from '../../utils';
import i18n from '../../utils/i18n';

export class WalletConnect {
  private connectWallet: ConnectWallet;

  constructor() {
    this.connectWallet = new ConnectWallet();
  }

  public async initWalletConnect(name: string): Promise<boolean> {
    const { provider, network, settings } = connectWallet;

    const connecting = this.connectWallet
      .connect(provider[name], network, settings)
      .then((connected: any | boolean) => {
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
    return this.connectWallet.currentWeb3() as any as Web3;
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

  public eventSubscribe(): void {
    this.connectWallet.eventSubscriber().subscribe(
      (data) => {
        clogData('EVENT DATA: ', data);
        if (data.address) {
          notify(
            `${i18n.t('notifications.wallet.connected')}: ${data.address.substring(
              0,
              4,
            )}...${data.address.slice(data.address.length - 4, data.address.length)}`,
            'success',
          );
        }
      },
      (error) => {
        clogData('EVENT ERROR: ', error);

        if (error.code === 4) {
          notify(`⚠️ Error: ${error.message.message}`, 'error');
        }

        if (error.code === 6) {
          notify(`⚠️ Error: ${error.message.message}`, 'error');
          setTimeout(() => window.location.reload(), 2000);
        }
        this.eventSubscribe();
      },
    );
  }

  public async getAccount(account: { address?: string; balance?: string }): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      this.connectWallet
        .getAccounts()
        .then(
          (userAccount: any) => {
            clogData('user account: ', userAccount);
            if (!account || userAccount.address !== account.address) {
              resolve(userAccount);
            }
          },
          (err: any) => {
            clogData('getAccount wallet connect - get user account err: ', err);
            reject(err);
          },
        )
        .finally(() => this.eventSubscribe());
    });
  }
}
