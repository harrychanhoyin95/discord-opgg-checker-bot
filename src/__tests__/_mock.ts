import { IConfig } from '~/typings/i-typings';
import config from '../config';

export interface IMockStorage {
  config: IConfig;
}

export function getMockStorage(): IMockStorage {
  return {
    config,
  };
}
