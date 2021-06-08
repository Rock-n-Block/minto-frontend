/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import { show_logs } from '../../config';

export const clog = (data: string): void => {
  if (show_logs) {
    console.log(data);
  }
};

export const clogData = (text: string, data: any): void => {
  if (show_logs) {
    console.log(text, data);
  }
};

export const clogGroup = (name: string, end?: boolean): void => {
  if (show_logs) {
    if (end) {
      console.groupEnd();
      return;
    }
    console.group(name);
  }
};
