import { Logger } from '@storage/logger';
import { IGlobalStorage } from '@typings/i-typings';

export class StorageBuilder {
  static getStorage(config): IGlobalStorage {
    const storage: any = {};

    storage.config = config;

    Logger.init();
    Logger.info('Initialized Logger');

    return {
      ...storage,
    };
  }
}
