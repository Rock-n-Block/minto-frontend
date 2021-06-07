import { toast, ToastOptions } from 'react-toastify';
import { ICodeInfo, ITemplateNotify } from '../../types';

export const errCode = (code: number): string => {
  const codeInfo = {
    4001: 'Signature transaction denied',
    4100: 'Unauthorized. The requested method and/or account has not been authorized by the user.',
    4200: 'Unsupported Method. The Provider does not support the requested method.',
    4900: 'Disconnected. The Provider is disconnected from all chains.',
    4901: 'Chain Disconnected. The Provider is not connected to the requested chain.',
  } as ICodeInfo;

  return codeInfo[code];
};

export const notify = (template: string | any, type?: string): void => {
  const options = {
    position: 'bottom-right',
    autoClose: 10000,
    hideProgressBar: true,
    closeOnClick: true,
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
