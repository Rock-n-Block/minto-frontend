import React from 'react';
import { useTranslation } from 'react-i18next';

import './StakingBlock.scss';

const StakingInfo: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="StakingBlock">
      <div className="row">
        <h2 className="StakingBlock-title h2 text-bold">
          {t('component.stacking.title')}
        </h2>
        <div className="StakingBlock-text text-lg">
          <p>{t('component.stacking.text1')}</p>
          <p>{t('component.stacking.text2')}</p>
          <p>{t('component.stacking.text3')}</p>
        </div>
      </div>
    </div>
  );
};

export default StakingInfo;
