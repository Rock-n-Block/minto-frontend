import { Trans } from 'react-i18next';

import IconExternalLink from '../../assets/img/icons/external-link.svg';
import { ICustomNotifyData } from '../../types';

export const customNotify = (data: ICustomNotifyData): any => {
  return (
    <div>
      {data.translate ? (
        <Trans
          i18nKey={data.translate.key} // optional -> fallbacks to defaults if not provided
          defaults='<p className="custom-notify-text">{text}</p>' // optional defaultValue
          values={{ text: data.text, data: data.translate.data }}
          components={{ italic: <i />, bold: <strong /> }}
        />
      ) : (
        // <Trans i18nKey={data.translate.key}>
        //   <p className="custom-notify-text">{data.text}</p>
        // </Trans>
        <p className="custom-notify-text">{data.text}</p>
      )}
      {data.link ? (
        <div className="custom-notify-link-wrap">
          <a className="custom-notify-link" target="_blank" href={data.link.url} rel="noreferrer">
            <img width="15px" height="15px" src={IconExternalLink} alt="external link" />
            {data.link.text}
          </a>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};
