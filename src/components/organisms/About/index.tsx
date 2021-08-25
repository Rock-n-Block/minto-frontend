import React from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as IconAudit } from '../../../assets/img/icons/audit.svg';
import { ReactComponent as IconDoc } from '../../../assets/img/icons/doc-detail.svg';
import { ReactComponent as IconNewspaper } from '../../../assets/img/icons/newspaper-folding.svg';
import { ReactComponent as IconPowerpoint } from '../../../assets/img/icons/powerpoint.svg';
import { Button } from '../../atoms';

import './About.scss';

const About: React.FC = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  return (
    <div className="about">
      <div className="row ">
        <section className="about__left">
          <h2 className="about__title h2 text-white text-bold">{t('component.aboutUs.title')}</h2>
          <p className="about__description text text-white">{t('component.aboutUs.text')}</p>

          <div className="about__btns">
            <a
              href="https://pool.huobi.com/pow/miners?signature=01834c444c9944ad8ade4cfea1a0f698"
              target="_blank"
              rel="noreferrer"
            >
              <Button
                colorScheme="green"
                size="lsm"
                className="about__btn text-smd text-upper text-bold-e text-white"
              >
                <span className="text-smd text-upper text-bold-e text-white">
                  {t('component.aboutUs.buttons.hashrate')}
                </span>
              </Button>
            </a>
            <a href="https://rtsp.me/embed/Y7FAt7aF/" target="_blank" rel="noreferrer">
              <Button className="about__btn" colorScheme="green" size="lsm">
                <span className="text-smd text-upper text-bold-e text-white">
                  {t('component.aboutUs.buttons.datacenterstream')}
                </span>
              </Button>
            </a>
          </div>
        </section>
        <section className="about__right">
          <p className="about__right-text text-gray-l text">{t('component.aboutUs.text2')}</p>
        </section>
        <section className="about__left">
          <div className="about__audit box-f-ai-c m-box-f-fd-c">
            <a href="/resources/MintoAuditReport.pdf" target="_blank" rel="noreferrer">
              <Button
                colorScheme="outline"
                size="lsm"
                className="about__btn text-smd text-upper text-bold-e text-white"
              >
                <IconAudit className="btn-icon" />
                <span className="text-smd text-upper text-bold-e text-white">
                  {t('component.aboutUs.buttons.audit')}
                </span>
              </Button>
            </a>
            <div className="about__audit-text text text-white">
              <a href="https://hacken.io/" className="text-green text">
                {t('component.aboutUs.auditLink')}
              </a>{' '}
              <span>{t('component.aboutUs.auditText')}</span>
            </div>
          </div>
          <p className="about__description-secondary text-green text">
            {t('component.aboutUs.text3')}
          </p>
          <div className="about__btns">
            <a href={`/resources/${language}/MintoPress-R.pdf`} target="_blank" rel="noreferrer">
              <Button
                colorScheme="outline"
                size="lsm"
                className="about__btn text-smd text-upper text-bold-e text-white"
              >
                <IconDoc className="btn-icon" />
                <span className="text-smd text-upper text-bold-e text-white">
                  {t('component.aboutUs.buttons.pressRelease')}
                </span>
              </Button>
            </a>
            <a
              href={`/resources/${language}/MintoPresentation.pdf`}
              target="_blank"
              rel="noreferrer"
            >
              <Button className="about__btn" colorScheme="outline" size="lsm">
                <IconPowerpoint className="btn-icon" />
                <span className="text-smd text-upper text-bold-e text-white">
                  {t('component.aboutUs.buttons.presentation')}
                </span>
              </Button>
            </a>
            <a href="/resources/MintoWhitepaper.pdf" target="_blank">
              <Button size="lg" colorScheme="outline" className="about__btn">
                <IconNewspaper className="btn-icon" />
                <span className="text-smd text-upper text-bold-e text-white">
                  {t('component.aboutUs.buttons.whitepaper')}
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
