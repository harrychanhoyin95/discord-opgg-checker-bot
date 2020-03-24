import { User } from 'discord.js';
import { IStorage } from '~typings/i-typings';
import { Champion, ChampionsModel } from './champion';

export const pixYouTube =
  'https://www.youtube.com/channel/UCyX_gEJaKTszr8XSnv3Wr1Q';

export class GearModel {
  constructor(
    private storage: IStorage,
    private championModel: ChampionsModel,
  ) {
    this.storage = storage;
    this.championModel = championModel;
  }

  // Generate the gear message
  async gen(author: User, message: string): Promise<any> {
    if (!message) return this.parseMessage('empty');

    const specialCases = /^((pix)|(lulu))$/g;
    if (message.match(specialCases)) {
      return this.parseMessage('pix');
    }

    const champions = await this.championModel.genChampions(author, message);

    if (!champions || champions.length === 0)
      return this.parseMessage('not-found');

    // Find the exact match champion
    const matchedChampion = champions.find(
      (champion) => champion.id.toLowerCase() === message,
    );

    if (matchedChampion) {
      const latestVersion = await this.championModel.getLatestVersionNumber();
      return this.parseMessage('found', matchedChampion, latestVersion);
    } else {
      const possibleChampions = champions.map(
        (champion, index) => `${index + 1}. ${champion.id}`,
      );
      const firstPart = this.parseMessage('multiple');
      return `${firstPart}${possibleChampions.join('\n')}`;
    }
  }

  // Parse message by message type
  parseMessage(
    messageType: string,
    champion?: Champion,
    version?: string,
  ): Promise<any> {
    let content = null;
    switch (messageType) {
      case 'empty':
        content = '試下打啲野...';
        break;
      case 'pix':
        content = `睇下鑽石Lulu點出裝啦！${pixYouTube}`;
        break;
      case 'not-found':
        content = '搵唔到隻英阿！';
        break;
      case 'multiple':
        content =
          '咁多隻搵唔到架，你試下打返佢地全名！\n你岩岩打出黎搵到既result有\n\n';
        break;
      case 'found':
        content = {
          embed: {
            color: 3447003,
            title: `${champion.name} - ${champion.title}`,
            // OP.GG requires champion name without any special characters
            // Eg. Lee Sin => leesin, Cho'Gath => chogath
            url: this.storage.config.opGG.statUrl(champion.id.toLowerCase()),
            description: `睇下${champion.name}點出裝啦`,
            thumbnail: {
              url: `${this.storage.config.ddragon.cdnUrl}/${version}/img/champion/${champion.image.full}`,
            },
            timestamp: new Date(),
            footer: {
              text: 'OP.GG',
            },
          },
        };
        break;
      default:
        content = 'Gag';
    }

    return content;
  }
}
