/* eslint-disable import/no-cycle */
import { createContext, FC, useContext } from 'react';
import { makeAutoObservable } from 'mobx';

import { ContractService } from '../services/contract';
import { IAccount, IContract, IInputVal, IMenu } from '../types';

class AppStore {
  menu: IMenu = { walletsOpen: false };
  account: IAccount = {};
  contracts: IContract = {};
  web3: any;
  decimals = '0';
  contractService: any;
  is_contractService = false;
  inputValue = {
    staking: 0,
    withdraw: 0,
    mining: 0,
  } as IInputVal;

  constructor() {
    makeAutoObservable(this);
  }

  setContractService = (): void => {
    this.contractService = new ContractService(this);
    this.is_contractService = true;
  };

  setWeb3 = (web3: Array<any>): void => {
    this.web3 = web3;
  };

  setDecimals = (value: string): void => {
    this.decimals = value;
  };

  setInputValue = (type: string, value: string | number): void => {
    this.inputValue[type] = value;
  };

  toggleWalletMenu = (value: boolean): void => {
    this.menu.walletsOpen = value;
  };

  updateAccount = (account: IAccount): void => {
    if (account.address) this.account.address = account.address;
    if (account.balance) this.account.balance = account.balance;
  };

  addContract = (name: string, contract: Array<any>): void => {
    this.contracts[name] = contract;
  };
}

const StoreContext = createContext<AppStore>(new AppStore());

const StoreProvider: FC<{ store: AppStore }> = ({ store, children }) => {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

const useStore = (): any => {
  return useContext(StoreContext);
};

export { AppStore, StoreProvider, useStore };
