import { User } from 'discord.js';
import fetch from 'node-fetch';
import { Logger } from '~storage/logger';
import { IStorage } from '~typings/i-typings';

const fallBackVersion = '10.5.1';

export interface Champion {
  id: string;
  name: string;
  title: string;
  image: {
    full: string;
  };
}

interface ChampionsResponse {
  type: string;
  format: string;
  version: string;
  data: {
    [key: string]: Champion;
  };
}

export class ChampionsModel {
  constructor(private storage: IStorage) {
    this.storage = storage;
  }

  // Get champions by message
  async genChampions(author: User, message: string): Promise<Champion[]> {
    try {
      const latestVersion = await this.getLatestVersionNumber();
      const championResponse = await fetch(
        `${this.storage.config.ddragon.cdnUrl}/${latestVersion}/data/en_US/champion.json`,
      );

      const champions: ChampionsResponse = await championResponse.json();

      if (!champions?.data) return [];
      const { data } = champions;

      return Object.values(data).filter((champion) => {
        return champion.id.toLowerCase().startsWith(message);
      });
    } catch (err) {
      Logger.error('gen-champions-error', err.stack, author, { message });
    }
  }

  // Get latest LOL version number
  async getLatestVersionNumber(): Promise<string> {
    try {
      const lolVersionListResponse = await fetch(
        `${this.storage.config.ddragon.apiUrl}/versions.json`,
      );
      const lolVersionList: {
        data: string[];
      } = await lolVersionListResponse.json();
      return (
        (lolVersionList.data &&
          lolVersionList.data.length > 0 &&
          lolVersionList.data[0]) ||
        fallBackVersion
      );
    } catch (err) {
      Logger.error('get-latest-version-error', err.stack, null);
    }
  }
}
