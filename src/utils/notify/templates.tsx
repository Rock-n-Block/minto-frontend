import IconExternalLink from '../../assets/img/icons/external-link.svg';
import { ICustomNotifyData } from '../../types';

export const customNotify = (data: ICustomNotifyData): any => {
  return (
    <div>
      <p className="custom-notify-text">{data.text}</p>
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
