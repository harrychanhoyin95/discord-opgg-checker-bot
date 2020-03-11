const Discord = require('discord.js');
const fetch = require('node-fetch');
require('dotenv').config();

const client = new Discord.Client();

const token = 'Njg3Mjk4NTg2MjY5OTc0NTQ1.XmkhRw.EQzgsO2uF2udiNY2bM1XOPR8dzM';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (message) => {
  const isBot = message.author.bot;
  const isMentioned = message.mentions.users.some((user) => user.id === '687298586269974545');
  if (isBot || !isMentioned) return;

  const normalizedMessage = message.content
    .toLowerCase()
    .split('>')[1]
    .replace(/\s+/g, '');

  // Lulu / Pix case
  if (normalizedMessage.includes('lulu') || normalizedMessage.includes('pix')) {
    return message.reply('睇下鑽石Pix點出裝啦！https://www.youtube.com/channel/UCyX_gEJaKTszr8XSnv3Wr1Q');
  }

  const LolVersionList = await fetch('https://ddragon.leagueoflegends.com/api/versions.json')
    .then((results) => results.json())
    .then((data) => data)
    .catch((err) => console.log(err));
  const newestVersion = LolVersionList[0];

  const championList = await fetch(`http://ddragon.leagueoflegends.com/cdn/${newestVersion}/data/en_US/champion.json`)
    .then((results) => results.json())
    .then((resultsJson) => resultsJson.data)
    .then((dataList) => Object.keys(dataList))
    .then((keyList) => keyList.map((key) => key.toLowerCase()))
    .catch((err) => console.log(err));

  const isExactMatch = championList.includes(normalizedMessage);
  const PartialMatchList = championList
    .filter((champion) => champion.includes(normalizedMessage));

  // Generic case
  if (isExactMatch) {
    return message.reply(`睇下點出裝啦！https://www.op.gg/champion/${normalizedMessage}/statistics`);
  }

  if (PartialMatchList.length > 0) {
    const indexedPartialMatchList = PartialMatchList.map((champ, index) => `${index + 1}. ${champ.replace(/^\w/, (c) => c.toUpperCase())}`);
    return message.reply(`咁多隻搵唔到架，你試下打返佢地全名！\n你岩岩打出黎搵到既result有\n\n${indexedPartialMatchList.join('\n')}`);
  }

  return message.reply('搵唔到隻英阿！');
});

client.login(token);
