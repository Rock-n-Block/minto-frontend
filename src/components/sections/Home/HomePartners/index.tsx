import React from 'react';
import { useTranslation } from 'react-i18next';

import LogoBancor from '../../../../assets/img/sections/home/logo-bancor.svg';
import LogoBestRate from '../../../../assets/img/sections/home/logo-best-rate.svg';
import LogoBinance from '../../../../assets/img/sections/home/logo-binance.svg';
import LogoEosPark from '../../../../assets/img/sections/home/logo-eospark.svg';
import LogoMeetOne from '../../../../assets/img/sections/home/logo-meet-one.svg';
import LogoNeo from '../../../../assets/img/sections/home/logo-neo.svg';
import LogoOkex from '../../../../assets/img/sections/home/logo-okex.svg';
import LogoPoloniDex from '../../../../assets/img/sections/home/logo-polonidex.svg';
import LogoRsk from '../../../../assets/img/sections/home/logo-rsk.svg';
import LogoWaves from '../../../../assets/img/sections/home/logo-waves.svg';

import './HomePartners.scss';

const HomePartners: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="home-partners">
      <div className="row">
        <h2 className="h2 text-bold text-center">{t('page.home.component.partners.title')}</h2>
        <div className="home-partners__container">
          <div className="home-partners__partner">
            <img src={LogoBinance} alt="rsk logo" />
          </div>
          <div className="home-partners__partner">
            <img src={LogoWaves} alt="rsk logo" />
          </div>
          <div className="home-partners__partner">
            <img src={LogoNeo} alt="neo logo" />
          </div>
          <div className="home-partners__partner">
            <img src={LogoEosPark} alt="eos logo" />
          </div>
          <div className="home-partners__partner">
            <img src={LogoMeetOne} alt="meet one logo" />
          </div>
          <div className="home-partners__partner">
            <img src={LogoRsk} alt="rsk logo" />
          </div>
          <div className="home-partners__partner">
            <img src={LogoOkex} alt="okex logo" />
          </div>
          <div className="home-partners__partner">
            <img src={LogoPoloniDex} alt="polonidex logo" />
          </div>
          <div className="home-partners__partner">
            <img src={LogoBestRate} alt="best rate logo" />
          </div>
          <div className="home-partners__partner">
            <img src={LogoBancor} alt="bancor logo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePartners;
