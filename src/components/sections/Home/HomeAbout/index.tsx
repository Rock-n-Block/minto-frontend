import React from 'react';
import IconNewspaper from '../../../../assets/img/icons/newspaper-folding.svg';
import IconDoc from '../../../../assets/img/icons/doc-detail.svg';
import IconPowerpoint from '../../../../assets/img/icons/powerpoint.svg';

import './HomeAbout.scss';
import {Button} from "../../../atoms";

const HomeAbout: React.FC = () => {
  return <div className='home-about'>
    <div className='row '>
      <section className='home-about__left'>
        <h2 className='home-about__title h2 text-white text-bold'>
          About
        </h2>
        <p className="home-about__description text-lg text-white">
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim
          velit mollit. Exercitation veniam consequat sunt nostrud amet.Amet minim mollit non deserunt ullamco est sit
          aliqua dolor do amet sint.
        </p>
        <Button size='lg' colorScheme="green" className="home-about__whitepaper-btn text-upper text-bold-e text-lmd"
                icon={IconNewspaper}>whitepaper</Button>
      </section>
      <section className='home-about__right'>
        <p className='home-about__right-text text-gray-l text'>
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim
          velit mollit. Exercitation veniam consequat sunt nostrud amet.Amet minim mollit non deserunt ullamco est sit
          aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt
          nostrud amet.
        </p>
      </section>
      <section className='home-about__left'>
        <p className='home-about__description-secondary text-green text'>
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
        </p>
        <div className='home-about__btns'>
          <Button colorScheme="outline" size="lsm" icon={IconDoc}
                  className='text-smd text-upper text-bold-e text-white'><span
            className='text-smd text-upper text-bold-e text-white'>press
            release</span></Button>
          <Button colorScheme="outline" size="lsm" icon={IconPowerpoint}
          ><span className='text-smd text-upper text-bold-e text-white'>presentation</span></Button>
        </div>
      </section>
    </div>
  </div>;
};

export default HomeAbout;
