import React from 'react';

import IconMail from '../../../../assets/img/icons/mail-open.svg';
import { Button } from '../../../atoms';

import './AboutContacts.scss';

const AboutContacts: React.FC = () => {
  return (
    <div id="contacts" className="about-contacts">
      <div className="row">
        <h2 className="h2 text-bold">Contacts</h2>
        <div className="about-contacts__countries">
          <div className="about-contacts__country">
            <h3 className="about-contacts__country-name text text-bold ">United Kingdom</h3>
            <ul className="about-contacts__country-description country-description">
              <li className=" country-description__item">Miotech Impex LP</li>
              <li className=" country-description__item">Company number: SL31818</li>
              <li className=" country-description__item">39/5 Granton Crescent</li>
              <li className=" country-description__item">Edinburgh</li>
              <li className=" country-description__item">United Kingdom, EH5 1BN</li>
            </ul>
          </div>
          <div className="about-contacts__country">
            <h3 className="about-contacts__country-name text text-bold ">Estonia</h3>
            <ul className="about-contacts__country-description country-description">
              <li className=" country-description__item">CryptoUniverse OÜ</li>
              <li className=" country-description__item">Company number: 14423879</li>
              <li className=" country-description__item">Roseni tn 13 Kesklinna linnaosa,</li>
              <li className=" country-description__item">Tallinn, Estonia, 10111</li>
            </ul>
          </div>
        </div>
        <Button icon={IconMail} className="about-contacts__support-btn" colorScheme="white">
          support@minto.io
        </Button>
      </div>
    </div>
  );
};

export default AboutContacts;
