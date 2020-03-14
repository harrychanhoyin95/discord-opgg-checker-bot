const Discord = require('discord.js');
const rollRole = require('./rollRole/rollRole');
const Champion = require('./champion');
require('dotenv').config();

const pixYouTube = 'https://www.youtube.com/channel/UCyX_gEJaKTszr8XSnv3Wr1Q';

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
  const championModel = new Champion(message);
  const isBot = message.author.bot;
  const isMentioned = message.mentions.users.some(
    user => user.id === process.env.CLIENT_ID
  );
  if (isBot || !isMentioned) return;

  const normalizedMessage = message.content
    .toLowerCase()
    .split('>')[1]
    .replace(/\s+/g, '');

  // Special cases
  switch (normalizedMessage) {
    case 'role':
    case 'roll':
      return rollRole(message);
    case 'pix':
    case 'lulu':
      return message.reply(`睇下鑽石Lulu點出裝啦！${pixYouTube}`);
    default:
  }

  const filteredChampions = await championModel.getChampions(message);

  if (!filteredChampions || filteredChampions.length === 0)
    return message.reply('搵唔到隻英阿！');

  // Find the exact match champion
  const matchedChampion = filteredChampions.find(
    champion => champion.id.toLowerCase() === normalizedMessage
  );

  if (matchedChampion) {
    return message.reply(
      `睇下${matchedChampion.name}點出裝啦！https://www.op.gg/champion/${normalizedMessage}/statistics`
    );
  } else {
    const possibleChampions = filteredChampions.map(
      (champion, index) => `${index + 1}. ${champion.name}`
    );
    return message.reply(
      `咁多隻搵唔到架，你試下打返佢地全名！\n你岩岩打出黎搵到既result有\n\n${possibleChampions.join(
        '\n'
      )}`
    );
  }
});

client.login(process.env.CLIENT_TOKEN).catch();
