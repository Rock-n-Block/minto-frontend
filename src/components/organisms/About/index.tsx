import React from 'react';

import IconDoc from '../../../assets/img/icons/doc-detail.svg';
import IconNewspaper from '../../../assets/img/icons/newspaper-folding.svg';
import IconPowerpoint from '../../../assets/img/icons/powerpoint.svg';
import { Button } from '../../atoms';

import './About.scss';

const About: React.FC = () => {
  return (
    <div className="about">
      <div className="row ">
        <section className="about__left">
          <h2 className="about__title h2 text-white text-bold">About</h2>
          <p className="about__description text-lg text-white">
            Simply put - mining is expensive. Keeping it profitable is another part of the story.
            Minto aims to lower both the risks and the entry threshold by tokenizing mining power in
            the form of the BTCMT token.
          </p>
          <Button
            size="lg"
            colorScheme="green"
            className="about__whitepaper-btn text-upper text-bold-e text-lmd"
            icon={IconNewspaper}
          >
            whitepaper
          </Button>
        </section>
        <section className="about__right">
          <p className="about__right-text text-gray-l text">
            Receive transparent mining rewards as if you had an ASIC-setup or make profits by buying
            and selling any amount of mining power without dealing with the problems of traditional
            mining.
          </p>
        </section>
        <section className="about__left">
          <p className="about__description-secondary text-green text">
            Bitcoin mining has never been easier. Learn more about the future of the mining industry
          </p>
          <div className="about__btns">
            <Button
              colorScheme="outline"
              size="lsm"
              icon={IconDoc}
              className="text-smd text-upper text-bold-e text-white"
            >
              <span className="text-smd text-upper text-bold-e text-white">press release</span>
            </Button>
            <Button colorScheme="outline" size="lsm" icon={IconPowerpoint}>
              <span className="text-smd text-upper text-bold-e text-white">presentation</span>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
