import { Database } from '~storage/database';
import { Logger } from '~storage/logger';
import { IStorage } from '~typings/i-typings';

/**
 * StorageBuilder setups all connectors to various services
 * Eg. Logger, API / DB connection
 * @class StorageBuilder
 */
export class StorageBuilder {
  static getStorage(config): IStorage {
    const storage: any = {};

    storage.config = config;

    Logger.init().then(() => {
      Logger.info('Initialized Logger');
    });

    Database.init();

    return {
      ...storage,
    };
  }
}
