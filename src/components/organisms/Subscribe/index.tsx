import React from 'react';
import { useTranslation } from 'react-i18next';

import IconMail from '../../../assets/img/icons/mail-package.svg';
import { API, clogData, notify } from '../../../utils';
import { Button, Input } from '../../atoms';

import './Subscribe.scss';

const Subscribe: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [isProcess, setIsProcess] = React.useState(false);

  const { t } = useTranslation();

  const handleSubscribeClick = async () => {
    setIsProcess(true);

    await API.post('/email/subscribe/', {
      email,
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
          {t('page.home.component.launch.text')}
        </h2>
        <div className="subscribe__e-mail input-container">
          <Input
            placeholder={t('page.home.component.launch.input')}
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
            <span className="text-upper text-bold-e text-smd">{t('button.processing')}</span>
          </Button>
        ) : (
          <Button size="smd" type="submit" colorScheme="green">
            <span className="text-upper text-bold-e text-smd">
              {t('page.home.component.launch.button')}
            </span>
          </Button>
        )}
      </form>
    </div>
  );
};

export default Subscribe;
