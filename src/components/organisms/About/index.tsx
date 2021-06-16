import React from 'react';
import { useTranslation } from 'react-i18next';

import IconDoc from '../../../assets/img/icons/doc-detail.svg';
import IconNewspaper from '../../../assets/img/icons/newspaper-folding.svg';
import IconPowerpoint from '../../../assets/img/icons/powerpoint.svg';
import { Button } from '../../atoms';

import './About.scss';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="about">
      <div className="row ">
        <section className="about__left">
          <h2 className="about__title h2 text-white text-bold">{t('component.aboutUs.title')}</h2>
          <p className="about__description text-lg text-white">{t('component.aboutUs.text')}</p>
          <a href="/resources/Whitepaper.pdf" target="_blank">
            <Button
              size="lg"
              colorScheme="green"
              className="about__whitepaper-btn text-upper text-bold-e text-lmd"
              icon={IconNewspaper}
            >
              {t('component.aboutUs.buttons.whitepaper')}
            </Button>
          </a>
        </section>
        <section className="about__right">
          <p className="about__right-text text-gray-l text">{t('component.aboutUs.text2')}</p>
        </section>
        <section className="about__left">
          <p className="about__description-secondary text-green text">
            {t('component.aboutUs.text3')}
          </p>
          <div className="about__btns">
            <Button
              colorScheme="outline"
              size="lsm"
              icon={IconDoc}
              className="btn-about text-smd text-upper text-bold-e text-white"
            >
              <span className="text-smd text-upper text-bold-e text-white">
                {t('component.aboutUs.buttons.pressRelease')}
              </span>
            </Button>
            <a href="/resources/Minto Presentation.pdf" target="_blank">
              <Button className="btn-about" colorScheme="outline" size="lsm" icon={IconPowerpoint}>
                <span className="text-smd text-upper text-bold-e text-white">
                  {t('component.aboutUs.buttons.presentation')}
                </span>
              </Button>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
