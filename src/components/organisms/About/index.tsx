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
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia
            consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.Amet
            minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
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
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia
            consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.Amet
            minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia
            consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
          </p>
        </section>
        <section className="about__left">
          <p className="about__description-secondary text-green text">
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
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
