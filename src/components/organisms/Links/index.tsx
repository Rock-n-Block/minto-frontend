import React from 'react';

import Github from '../../../assets/img/icons/github.svg';
import Medium from '../../../assets/img/icons/medium.svg';
import Telegram from '../../../assets/img/icons/telegram.svg';
import Twitter from '../../../assets/img/icons/twitter.svg';
import { API, clogData, notify } from '../../../utils';
import { Button, Input } from '../../atoms';

import './Links.scss';

const Links: React.FC = () => {
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
    <div className="links">
      <div className="row ">
        <div className="links__link link__subscribe">
          <h3 className="links__title text-center text text-white text-bold-e">Subscribe</h3>
          <div className="link__subscribe__social-networks">
            <a
              href="https://twitter.com/btcmtofficial"
              target="_blank"
              className="link__subscribe__network circle box-f-c"
              rel="noreferrer"
            >
              <img src={Twitter} alt="Twitter" />
            </a>
            <a href="/#" target="_blank" className="link__subscribe__network circle box-f-c">
              <img src={Medium} alt="Medium" />
            </a>
            <a href="/#" target="_blank" className="link__subscribe__network circle box-f-c">
              <img src={Github} alt="Github" />
            </a>
          </div>
        </div>
        <form
          className="links__link link__subscribe-email"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubscribeClick();
          }}
        >
          <h3 className="links__title text-center text text-white text-bold-e">
            Subscribe to the news by email
          </h3>
          <div className="link__subscribe-email__e-mail input-container">
            <Input type="email" required placeholder="Enter your email" shadow />
          </div>

          {isProcess ? (
            <Button
              size="smd"
              disabled
              type="submit"
              colorScheme="green"
              className="link__subscribe-email__submit-btn"
            >
              <span className="text-upper text-bold-e text-smd">Processing...</span>
            </Button>
          ) : (
            <Button
              size="smd"
              type="submit"
              colorScheme="green"
              className="link__subscribe-email__submit-btn"
            >
              <span className="text-upper text-bold-e text-smd">Subscribe</span>
            </Button>
          )}
        </form>
        <div className="links__link link__chat">
          <h3 className="links__title text-center text text-white text-bold-e">
            Talk to the team and like-minded people
          </h3>
          <a
            href="https://t.me/btcmtofficial"
            target="_blank"
            className="link__chat-tg circle box-f-c"
            rel="noreferrer"
          >
            <img src={Telegram} alt="Telegram" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Links;
