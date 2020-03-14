const fetch = require('node-fetch');
const championUrl = require('../config');

const fallBackVersion = '10.5.1';

module.exports = class Champions {
  constructor(message) {
    this.message = message;
  }

  // Get latest LOL version number
  static async getLatestVersionNumber() {
    try {
      const lolVersionListResponse = await fetch(
        `${championUrl.api}/versions.json`
      );
      const lolVersionList = await lolVersionListResponse.json();
      return (
        (lolVersionList.data &&
          lolVersionList.data.length > 0 &&
          lolVersionList.data[0]) ||
        fallBackVersion
      );
    } catch (err) {
      console.log(err);
    }
  }

  // Get champions by message
  async getChampions() {
    try {
      const latestVersion = await Champions.getLatestVersionNumber();
      const championResponse = await fetch(
        `${championUrl.cdn}/${latestVersion}/data/en_US/champion.json`
      );
      const champions = await championResponse.json();
      if (!champions.data || champions.data.length === 0) return [];
      const { data: championList } = champions;
      return Object.values(championList).filter(champion => {
        return champion.id.toLowerCase().startsWith(this.message);
      });
    } catch (err) {
      console.log(err);
    }
  }
};
