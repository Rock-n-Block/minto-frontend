import React from 'react';

import IconMail from '../../../assets/img/icons/mail-package.svg';
import { API, clogData, notify } from '../../../utils';
import { Button, Input } from '../../atoms';

import './Subscribe.scss';

const Subscribe: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [isProcess, setIsProcess] = React.useState(false);

  const handleSubscribeClick = async () => {
    setIsProcess(true);

    API.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
    API.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

    await API.post('/email/subscribe/', {
      email,
    })
      .then((res: any) => {
        clogData('subscribe: ', res);
        notify('Thanks for subscribing!', 'success');
        setEmail('');
      })
      .catch((err: any) => {
        clogData('error in subscribe', err);
        notify('Something went wrong! Please try again later.', 'error');
      })
      .finally(() => {
        setIsProcess(false);
      });
  };

  return (
    <div className="subscribe">
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubscribeClick();
        }}
      >
        <div className="subscribe__icon circle">
          <img src={IconMail} alt="mail" />
        </div>
        <h2 className="subscribe__title text-center h2-md text-white text-medium">
          We’re launching soon, subscribe to be the first to know!
        </h2>
        <div className="subscribe__e-mail input-container">
          <Input
            placeholder="Enter your email"
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            colorScheme="white"
            value={email}
            size="md"
            shadow
          />
        </div>
        {isProcess ? (
          <Button size="smd" disabled type="submit" colorScheme="green">
            <span className="text-upper text-bold-e text-smd">Processing...</span>
          </Button>
        ) : (
          <Button size="smd" type="submit" colorScheme="green">
            <span className="text-upper text-bold-e text-smd">Subscribe</span>
          </Button>
        )}
      </form>
    </div>
  );
};

export default Subscribe;
