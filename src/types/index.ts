import { BigNumber } from 'bignumber.js/bignumber';

export interface IMenu {
  walletsOpen: boolean;
}

export interface IAccount {
  address?: string;
  balance?: string;
}

export interface IContract {
  [name: string]: any;
}

export interface IInputVal {
  [name: string]: any;
}

export interface IDataContract {
  key: string;
  value: string | number | BigNumber;
}

export interface IConfig {
  tx: { link: string };
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

export interface IRoles {
  [index: string]: {
    contractRole: string;
    role: string;
  };
}

export interface IContracts {
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

export interface IData {
  [index: string]: string | number;
}

export interface ITableData {
  date: string;
  reward: number;
  status: boolean;
}

export interface ITemplateNotify {
  [index: string]: () => {};
}

export interface ICustomNotifyData {
  text: string;
  link?: {
    url: string;
    text: string;
  };
}

export interface ICodeInfo {
  [index: number]: string;
}
