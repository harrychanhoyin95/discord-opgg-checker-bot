const fetch = require('node-fetch');
const Logger = require('../storage/logger');

const fallBackVersion = '10.5.1';

module.exports = class ChampionsModel {
  constructor(storage) {
    this.storage = storage;
  }

  // Get latest LOL version number
  async getLatestVersionNumber() {
    try {
      const lolVersionListResponse = await fetch(
        `${this.storage.config.ddragon.apiUrl}/versions.json`
      );
      const lolVersionList = await lolVersionListResponse.json();
      return (
        (lolVersionList.data &&
          lolVersionList.data.length > 0 &&
          lolVersionList.data[0]) ||
        fallBackVersion
      );
    } catch (err) {
      Logger.error('get-latest-version-error', err, null);
    }
  }

  // Get champions by message
  async genChampions(author, message) {
    try {
      const latestVersion = await this.getLatestVersionNumber();
      const championResponse = await fetch(
        `${this.storage.config.ddragon.cdnUrl}/${latestVersion}/data/en_US/champion.json`
      );
      const champions = await championResponse.json();

      if (!champions.data || champions.data.length === 0) return [];
      const { data: championList } = champions;

      return Object.values(championList).filter(champion => {
        return champion.id.toLowerCase().startsWith(message);
      });
    } catch (err) {
      Logger.error('gen-champions-error', err, author, { message });
    }
  }
};
