import { MongoClient } from '~/storage/mongo-client';
import { Logger } from '~storage/logger';
import { IStorage } from '~typings/i-typings';

/**
 * StorageBuilder setups all connectors to various services
 * Eg. Logger, API / DB connection
 * @class StorageBuilder
 */
export class StorageBuilder {
  static async getStorage(config): Promise<IStorage> {
    const storage: any = {};

    storage.config = config;

    await Logger.init();

    await MongoClient.init();

    return {
      ...storage,
    };
  }
}
