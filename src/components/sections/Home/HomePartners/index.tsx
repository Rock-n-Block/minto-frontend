import React from 'react';
import { useTranslation } from 'react-i18next';

import LogoHacken from '../../../../assets/img/sections/home/logo-hacken.svg';
import LogoHeco from '../../../../assets/img/sections/home/logo-heco.svg';
import LogoHuobipool from '../../../../assets/img/sections/home/logo-huobipool.svg';
import LogoRocknBlock from '../../../../assets/img/sections/home/logo-rnb.svg';

import './HomePartners.scss';

const HomePartners: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="home-partners">
      <div className="row">
        <h2 className="h2 text-bold text-center">{t('page.home.component.partners.title')}</h2>
        <div className="home-partners__container">
          <div className="home-partners__partner">
            <img src={LogoHacken} alt="hacken logo" />
          </div>
          <div className="home-partners__partner">
            <img src={LogoHeco} alt="heco logo" />
          </div>
          <div className="home-partners__partner">
            <img src={LogoHuobipool} alt="huobipool logo" />
          </div>
          <div className="home-partners__partner">
            <img src={LogoRocknBlock} alt="rocknblock logo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePartners;
