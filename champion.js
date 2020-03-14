const fetch = require('node-fetch');

const fallBackVerision = '10.5.1';
const lolVersionListUrl =
  'https://ddragon.leagueoflegends.com/api/versions.json';

module.exports = class Champions {
  constructor(message) {
    this.message = message;
  }

  static async getLatestVersionNumber() {
    try {
      const lolVersionListResponse = await fetch(lolVersionListUrl);
      const lolVersionList = await lolVersionListResponse.json();
      return (
        (lolVersionList.data &&
          lolVersionList.data.length > 0 &&
          lolVersionList.data[0]) ||
        fallBackVerision
      );
    } catch (err) {
      console.log(err);
    }
  }

  async getChampions() {
    const normalizedMessage = this.message.content
      .toLowerCase()
      .split('>')[1]
      .replace(/\s+/g, '');

    try {
      const latestVersion = await Champions.getLatestVersionNumber();
      const championResponse = await fetch(
        `http://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`
      );
      const champions = await championResponse.json();
      if (!champions.data || champions.data.length === 0) return [];
      const { data: championList } = champions;
      return Object.values(championList).filter(champion => {
        return champion.id.toLowerCase().startsWith(normalizedMessage);
      });
    } catch (err) {
      console.log(err);
    }
  }
};
