import React from 'react';
import { useTranslation } from 'react-i18next';

import Facebook from '../../../assets/img/icons/facebook.svg';
import Telegram from '../../../assets/img/icons/telegram.svg';
import Twitter from '../../../assets/img/icons/twitter.svg';
import WeChat from '../../../assets/img/icons/weChat.svg';
import { API, clogData, notify } from '../../../utils';
import { Button, Input } from '../../atoms';
import { ModalQR } from '..';

import './Links.scss';

const Links: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [isProcess, setIsProcess] = React.useState(false);
  const [modalQr, setModalQr] = React.useState(false);

  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const handleSubscribeClick = async () => {
    setIsProcess(true);

    await API.post('/email/subscribe/', {
      email,
      lang,
    })
      .then((res: any) => {
        clogData('subscribe: ', res);
        notify(`${t('notifications.success.subscribe')}`, 'success');
        setEmail('');
      })
      .catch((err: any) => {
        clogData('error in subscribe', err);
        notify(`${t('notifications.error.text')} ${t('notifications.error.tryAgain')}`, 'error');
      })
      .finally(() => {
        setIsProcess(false);
      });
  };

  const showModalQR = () => {
    setModalQr(true);
  };

  return (
    <div className="links">
      {modalQr ? <ModalQR showModal={modalQr} closeModal={setModalQr} /> : ''}
      <div className="row ">
        <div className="links__link link__subscribe">
          <h3 className="links__title text-center text text-white text-bold-e">
            {t('page.home.component.subscribe.text.left')}
          </h3>
          <div className="link__subscribe__social-networks">
            <a
              href="https://twitter.com/btcmtofficial"
              target="_blank"
              className="link__subscribe__network circle box-f-c"
              rel="noreferrer"
            >
              <img src={Twitter} alt="Twitter" />
            </a>
            <a
              href="https://www.facebook.com/btcmtofficial"
              rel="noreferrer"
              target="_blank"
              className="link__subscribe__network circle box-f-c"
            >
              <img src={Facebook} alt="Facebook" />
            </a>
            <span className="link__subscribe__network no-border circle box-f-c"> </span>
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
            {t('page.home.component.subscribe.text.center')}
          </h3>
          <div className="link__subscribe-email__e-mail input-container">
            <Input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              placeholder={t('page.home.component.subscribe.input')}
              shadow
            />
          </div>

          {isProcess ? (
            <Button
              size="smd"
              disabled
              type="submit"
              colorScheme="green"
              className="link__subscribe-email__submit-btn"
            >
              <span className="text-upper text-bold-e text-smd">{t('button.processing')}</span>
            </Button>
          ) : (
            <Button
              size="smd"
              type="submit"
              colorScheme="green"
              className="link__subscribe-email__submit-btn"
            >
              <span className="text-upper text-bold-e text-smd">
                {t('page.home.component.subscribe.button')}
              </span>
            </Button>
          )}
        </form>
        <div className="links__link link__chat">
          <h3 className="links__title text-center text text-white text-bold-e">
            {t('page.home.component.subscribe.text.right')}
          </h3>
          {lang === 'en' ? (
            <a
              href="https://t.me/btcmtofficialchat"
              target="_blank"
              className="link__chat-tg circle box-f-c"
              rel="noreferrer"
            >
              <img src={Telegram} alt="Telegram" />
            </a>
          ) : (
            <button
              type="button"
              className="link__chat-tg circle box-f-c"
              onClick={() => showModalQR()}
            >
              <img src={WeChat} alt="WeChat" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Links;
