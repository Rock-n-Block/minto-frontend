import axios from 'axios';

import { backend } from '../../config';
import { clogData } from '../logger';

// console.log(process.env.NODE_ENV);

export const API = axios.create({
  baseURL: `${backend.url}`,
  responseType: 'json',
});

export async function getDailyRewards(): Promise<number> {
  const value = await API.get('/total/history/today/').then((res: any) => {
    clogData('history: ', res.data);
    return res.data.value;
  });
  // .catch((error: any) => {
  //   clogData('history error: ', error);
  // });

  return value;
}

export default API;
