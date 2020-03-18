const Logger = require('./logger');

module.exports = class StorageBuilder {
  static getStorage(config) {
    const storage = {};

    storage.config = config;

    Logger.init();
    Logger.info('Initialized Logger');

    return {
      ...storage,
    };
  }
};
