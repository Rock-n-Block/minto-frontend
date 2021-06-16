import React from 'react';
import { useTranslation } from 'react-i18next';

import { IData } from '../../../../types';
import { Info } from '../../../atoms';

import './StakingInfo.scss';

interface IStakingInfo {
  info: IData;
  token: string;
}

const StakingInfo: React.FC<IStakingInfo> = ({ info, token }) => {
  const { t } = useTranslation();

  return (
    <div className="staking__info">
      <div className="row">
        <div className="staking__info-content">
          <Info
            topText={t('page.staking.tokenPrice')}
            content={info.tokenPrize}
            bottomText={token}
          />
          <Info
            topText={t('page.staking.totalSupply')}
            content={info.totalSupply}
            bottomText={token}
          />
          <Info
            topText={t('page.staking.availableToStake')}
            content={info.availableToStake}
            bottomText={token}
          />
          <Info
            topText={t('page.staking.totalStaked')}
            content={info.alreadyStaked}
            bottomText={token}
          />
        </div>
      </div>
    </div>
  );
};

export default StakingInfo;
