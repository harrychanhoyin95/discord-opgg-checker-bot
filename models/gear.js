const pixYouTube = 'https://www.youtube.com/channel/UCyX_gEJaKTszr8XSnv3Wr1Q';

module.exports = class Gear {
  constructor(storage, championModel) {
    this.storage = storage;
    this.championModel = championModel;
  }

  // Generate the gear message
  async gen(author, message) {
    const specialCases = /^((pix)|(lulu))$/g;
    if (message.match(specialCases)) {
      return this.parseMessage('pix');
    }

    const champions = await this.championModel.genChampions(author, message);

    if (!champions || champions.length === 0)
      return this.parseMessage('not-found');

    // Find the exact match champion
    const matchedChampion = champions.find(
      champion => champion.id.toLowerCase() === message
    );

    if (matchedChampion) {
      return this.parseMessage('found', matchedChampion);
    } else {
      const possibleChampions = champions.map(
        (champion, index) => `${index + 1}. ${champion.name}`
      );
      const firstPart = this.parseMessage('multiple');
      return `${firstPart}${possibleChampions.join('\n')}`;
    }
  }

  async parseMessage(messageType, champion) {
    const latestVersion = await this.championModel.getLatestVersionNumber();
    let content = null;
    switch (messageType) {
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
            url: this.storage.config.opGG.statUrl(champion.name.toLowerCase()),
            description: `睇下${champion.name}點出裝啦`,
            thumbnail: {
              url: `${this.storage.config.ddragon.cdnUrl}/${latestVersion}/img/champion/${champion.image.full}`,
            },
            timestamp: new Date(),
            footer: {
              text: 'OP.GG',
            },
          },
        };
        break;
      default:
    }

    return content;
  }
};
