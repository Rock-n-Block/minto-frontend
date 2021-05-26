import React from 'react';

import IconMail from '../../../assets/img/icons/mail-package.svg';
import { Button, Input } from '../../atoms';

import './Subscribe.scss';

const Subscribe: React.FC = () => {
  return (
    <div className="subscribe">
      <div className="row">
        <div className="subscribe__icon circle">
          <img src={IconMail} alt="mail" />
        </div>
        <h2 className="subscribe__title text-center h2-md text-white text-medium">
          We’re launching soon, subscribe to be the first to know!
        </h2>
        <div className="subscribe__e-mail input-container">
          <Input placeholder="Enter your email" colorScheme="white" size="md" shadow />
        </div>
        <Button size="smd" colorScheme="green">
          <span className="text-upper text-bold-e text-smd">Subscribe</span>
        </Button>
      </div>
    </div>
  );
};

export default Subscribe;
