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

export interface IStakingInfo {
  tokenPrize: string;
  totalSupply: string;
  alreadyStaked: string;
  availableToStake: string;
  availableToStakeLocked: string;
  balanceOf: string;
  inWallet: string;
  userStakes: string;
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
