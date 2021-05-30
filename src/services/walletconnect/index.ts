import { ConnectWallet } from '@amfi/connect-wallet';

import { config, contracts } from '../../config';

export class WalletConnect {
  private connectWallet: any;

  constructor() {
    this.connectWallet = new ConnectWallet();
  }

  public async initWalletConnect(name: string): Promise<boolean> {
    const {
      connectWallet: { provider, settings },
      network,
    } = config;

    console.log(network);

    const connecting = this.connectWallet
      .connect(provider[name], network, settings)
      .then((connected: boolean) => {
        if (connected) {
          this.initializeContracts();
        }
        return connected;
      })
      .catch((err: any) => {
        console.log('initWalletConnect providerWallet err', err);
      });

    return Promise.all([connecting]).then((connect: any) => {
      return connect[0];
    });
  }

  public logOut(): void {
    this.connectWallet.resetConect();
  }

  public getContract(name: string) {
    return this.connectWallet.Contract(name);
  }

  public Web3() {
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
        .then((status: boolean) =>
          console.log(`Contract ${name} added`, status, this.connectWallet.Contract(name)),
        );
    });
  }

  public async getTokenBalance(address: string): Promise<string | number> {
    return this.connectWallet
      .Contract('Token')
      .methods.balanceOf(address)
      .call()
      .then((balance: string | number) => {
        console.log(address, balance);
        return balance;
      });
  }

  public getAccount(account: { address?: string; balance?: string }): Promise<any> {
    return new Promise((resolve: any, reject) => {
      this.connectWallet.getAccounts().subscribe(
        (userAccount: any) => {
          console.log(userAccount);
          if (!account || userAccount.address !== account.address) {
            resolve(userAccount);
          }
        },
        (err: any) => {
          console.log(err);
          reject(err);
        },
      );
    });
  }
}
