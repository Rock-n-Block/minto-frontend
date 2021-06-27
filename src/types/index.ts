import { BigNumber } from 'bignumber.js/bignumber';

import { INetwork, IProvider, ISettings } from '../../../../Projects/connect-wallet/dist/interface';

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
}

export interface ITableData {
  date: string;
  value: number;
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
