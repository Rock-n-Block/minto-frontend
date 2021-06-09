import { IRoles } from '../../types';

export const rolesByHex: IRoles = {
  '0x00': {
    contractRole: 'DEFAULT_ADMIN_ROLE',
    role: 'Admin',
  },
};

export const rolesByContact = {
  DEFAULT_ADMIN_ROLE: '0x00',
};
