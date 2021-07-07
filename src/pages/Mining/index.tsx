import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import { HistoryTable, Procedure } from '../../components/organisms';
import { chain, config, update_after_tx_timeout } from '../../config';
import { useStore } from '../../store';
import { IData, IUserHistory } from '../../types';
import { API, clogData, customNotify, deNormalizedValue, errCode, notify } from '../../utils';

import './Mining.scss';

const Mining: React.FC = () => {
  const store = useStore();

  const [miningInfo, setMiningInfo] = React.useState({} as IData);
  const [tdata, settData] = React.useState({ total: '0', history: [] } as IUserHistory);

  const [mnValue, setMnValue] = React.useState(0);
  const [miningProgress, setMiningProgress] = React.useState(false);

  const { t } = useTranslation();

  const getMiningInfo = useCallback(async () => {
    if (!store.is_contractService) store.setContractService();

    setMiningInfo(await store.contractService.miningInfo());

    await API.post('/user/history/', {
      address: store.account.address,
    })
      .then((res: any) => {
        clogData('User history: ', res);
        settData(res.data);
      })
      .catch((error: any) => {
        if (error.response) {
          if (error.response.status === 500) notify(`Cant't load history.`, 'error');
          if (error.response.status === 404) {
            notify(`User history not found.`, 'warning');
          }
          clogData(`User history got error status ${error.response.status}: `, error.response.data);
        }
      });
  }, [store]);

  // Change amounts ------------------------------------------------

  const handleChangeClaimAmount = (value: any): void => {
    setMnValue(value);
    if (value < 0) setMnValue(0);
    if (value > +miningInfo.availableToClaim) setMnValue(+miningInfo.availableToClaim);
  };

  // Send Max ------------------------------------------------

  const handleButtonClick = (): void => {
    setMnValue(+miningInfo.availableToClaim);
  };

  // Send Tx ------------------------------------------------

  const handleButtonClaimClick = (): void => {
    if (+mnValue === 0 && +mnValue <= 0) {
      notify(`${t('notifications.claim.inputError')}`, 'error');
      return;
    }

    setMiningProgress(true);
    if (mnValue === +miningInfo.availableToClaim) {
      store.contractService
        .claimAllReward()
        .then(
          (data: any) => {
            notify(
              customNotify({
                translate: {
                  key: 'notifications.claim.complete',
                  data: {
                    token: 'HBTC',
                    value: +miningInfo.availableToClaim,
                  },
                },
                text: `Your Claim ${+miningInfo.availableToClaim} HBTC complete!`,
                link: {
                  url: `${chain.tx.link}/${data[1]}`,
                  text: `${t('notifications.claim.link')}`,
                },
              }),
              'success',
            );

            setTimeout(() => {
              getMiningInfo();
            }, update_after_tx_timeout);
          },
          (err: any) => clogData('claim err: ', err),
        )
        .finally(() => {
          setMiningProgress(false);
          setMnValue(0);
        });

      return;
    }

    const amount = deNormalizedValue(mnValue);

    store.contractService
      .claimReward(amount)
      .then(
        (data: any) => {
          notify(
            customNotify({
              translate: {
                key: 'notifications.claim.complete',
                data: {
                  token: 'HBTC',
                  value: mnValue,
                },
              },
              text: `Your Claim ${mnValue} HBTC complete!`,
              link: {
                url: `${chain.tx.link}/${data[1]}`,
                text: `${t('notifications.claim.link')}`,
              },
            }),
            'success',
          );
          setTimeout(() => {
            getMiningInfo();
          }, update_after_tx_timeout);
        },
        (err: any) => {
          clogData('claim err: ', err);
          notify(`${t('notifications.error.text')} ${errCode(err.code)}`, 'error');
        },
      )
      .finally(() => {
        setMiningProgress(false);
        setMnValue(0);
      });
  };

  // On Run ------------------------------------------------

  React.useEffect(() => {
    if (!store.account.address && config.menu.onlyForAuth) {
      store.toggleWalletMenu(true);
    }
    if (!store.account.address) return;
    getMiningInfo();
  }, [getMiningInfo, store.account.address, store]);

  // Template ------------------------------------------------

  return (
    <div className="mining">
      {store.account.address ? (
        <div>
          <Procedure
            title={t('page.mining.title')}
            info={[
              {
                title: t('page.mining.text.left'),
                value: `${miningInfo.th} TH/s`,
              },
              {
                title: t('page.mining.text.right'),
                value: `${miningInfo.availableToClaim} HBTC`,
              },
            ]}
            miniButtonShow
            inputTitle={t('page.mining.textButton')}
            btnAllText={t('page.mining.button')}
            btnClick={handleButtonClick}
            submitBtnText={t('page.mining.button2')}
            btnProcessed={miningProgress}
            btnProcessedText={t('button.processing')}
            buttonClick={handleButtonClaimClick}
            inputChange={handleChangeClaimAmount}
            inputValue={mnValue}
          />

          <HistoryTable
            title={t('page.mining.history.title')}
            head={{
              date: t('page.mining.history.table.col.0'),
              revard: t('page.mining.history.table.col.1'),
            }}
            body={tdata.history}
            total={{
              title: t('page.mining.history.table.col.2'),
              value: `${0}`,
            }}
          />
        </div>
      ) : (
        <div className="no_login_data">
          <span className="links__title text-center text text-black text-bold-e">
            {t('info.connectWallet')}
          </span>
        </div>
      )}
    </div>
  );
};

export default observer(Mining);
