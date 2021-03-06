import { INetwork, IProvider, ISettings } from '@amfi/connect-wallet/dist/interface';
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

export interface IRoles {
  [index: string]: {
    contractRole: string;
    role: string;
  };
}

export interface IData {
  [index: string]: string | number;
}

export interface IUserHistory {
  total: string;
  history: ITableData[];
  total_reward: string | number;
}

export interface ITableData {
  date: string;
  value: number | string;
  status: boolean;
}

export interface ITemplateNotify {
  [index: string]: () => {};
}

export interface ICustomNotifyData {
  translate?: {
    key?: string;
    data?: {
      [index: string]: string | number;
    };
  };
  text?: string;
  link?: {
    url: string;
    text: string;
  };
}

export interface ICodeInfo {
  [index: number]: string;
}

// Iterfaces for configuration ---------------------------------------------------------------

export interface IAppConfig {
  menu: {
    open: {
      openConnectModal: boolean;
    };
    onlyForAuth: boolean;
  };
}

export interface IBackendConfig {
  url: string;
}

export interface IChainConfig {
  name: string;
  id: number;
  rpc: string;
  tx: {
    link: string;
  };
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExp: string;
}

export interface IConnectWallet {
  wallets: string[];
  network: INetwork;
  provider: {
    [index: string]: IProvider;
  };
  settings: ISettings;
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
