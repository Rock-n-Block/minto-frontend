import i18n from '../i18n';
import { toast, ToastOptions } from 'react-toastify';
import { ITemplateNotify } from '../../types';

export const errCode = (code: number): string => {
  const codes = [4001, 4100, 4200, 4900, 4901];
  return i18n.t(`notifications.metaMask.error.${codes.includes(code) ? code : 0}`);
};

export const notify = (template: string | any, type?: string): void => {
  const options = {
    position: 'bottom-right',
    autoClose: 7000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
  } as ToastOptions;

  const templateNotify = {
    default: () => toast(template, options),
    info: () => toast.info(template, options),
    success: () => toast.success(template, options),
    warning: () => toast.warning(template, options),
    error: () => toast.error(template, options),
  } as ITemplateNotify;

  templateNotify[type || 'default']();
};

export * from './templates';
