import { makeAutoObservable } from 'mobx';
import { createContext, FC, useContext } from 'react';

interface IMenu {
  walletsOpen: boolean;
}

interface IAccount {
  address?: string;
  balance?: string;
}

interface IContract {
  [name: string]: any;
}

class AppStore {
  menu: IMenu = { walletsOpen: false };
  account: IAccount = {};
  contracts: IContract = {};
  web3: any;

  constructor() {
    makeAutoObservable(this);
  }

  setWeb3 = (web3: any) => {
    this.web3 = web3;
  };

  toggleWalletMenu = (value: boolean) => {
    this.menu.walletsOpen = value;
  };

  updateAccount = (account: IAccount) => {
    this.account = account;
  };

  addContract = (name: string, contract: any) => {
    this.contracts[name] = contract;
  };
}

const StoreContext = createContext<AppStore>(new AppStore());

const StoreProvider: FC<{ store: AppStore }> = ({ store, children }) => {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

const useStore = () => {
  return useContext(StoreContext);
};

export { AppStore, StoreProvider, useStore };
