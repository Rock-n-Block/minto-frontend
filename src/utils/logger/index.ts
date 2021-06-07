/* eslint-disable class-methods-use-this */
import { is_production } from '../../config';

export const clog = (data: string) => {
  if (!is_production) {
    console.log(data);
  }
};
