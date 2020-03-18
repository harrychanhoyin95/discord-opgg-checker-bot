const Discord = require('discord.js');
const fs = require('fs');
const StorageBuilder = require('./storage/storage-builder');
const Logger = require('./storage/logger');
const Models = require('./models/_models');
const config = require('./config');

require('dotenv').config();

// const pixYouTube = 'https://www.youtube.com/channel/UCyX_gEJaKTszr8XSnv3Wr1Q';

// Parses what message to return by type
// const parseMessage = async (type, champion) => {
//   let content = null;
//   const latestVersion = await Champion.getLatestVersionNumber();

//   switch (type) {
//     case 'roll':
//       content = rollRole();
//       break;
//     case 'pix':
//       content = `睇下鑽石Lulu點出裝啦！${pixYouTube}`;
//       break;
//     case 'not-found':
//       content = '搵唔到隻英阿！';
//       break;
//     case 'multiple':
//       content =
//         '咁多隻搵唔到架，你試下打返佢地全名！\n你岩岩打出黎搵到既result有\n\n';
//       break;
//     case 'found':
//       content = {
//         embed: {
//           color: 3447003,
//           title: `${champion.name} - ${champion.title}`,
//           url: `https://www.op.gg/champion/${champion.name.toLowerCase()}/statistics`,
//           description: `睇下${champion.name}點出裝啦`,
//           thumbnail: {
//             url: `${championUrl.cdn}/${latestVersion}/img/champion/${champion.image.full}`,
//           },
//           timestamp: new Date(),
//           footer: {
//             text: 'OP.GG',
//           },
//         },
//       };
//       break;
//     default:
//       content = 'Broken Gag';
//   }

//   return content;
// };

let models = null;
const storage = StorageBuilder.getStorage(config);
const client = new Discord.Client();
client.commands = new Discord.Collection();

// Reads command files
const commandFiles = fs
  .readdirSync('./commands')
  .filter(file => file.endsWith('.js'));

// Setup available commands
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', () => {
  models = Models.getModels(storage);
  Logger.info(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  // Split by spaces
  const args = message.content
    .toLowerCase()
    .slice(config.prefix.length)
    .split(/ +/);
  const command = args.shift().toLowerCase();

  if (!client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(message, args, models);
  } catch (error) {
    Logger.error('command-error', error, message.author, { command, args });
    return message.reply('There was an error trying to execute that command!');
  }

  // let botReply = '';
  // const isBot = message.author.bot;
  // const isMentioned = message.mentions.users.some(
  //   user => user.id === process.env.CLIENT_ID
  // );
  // if (isBot || !isMentioned) return;

  // const normalizedMessage = message.content
  //   .toLowerCase()
  //   .split('>')[1]
  //   .replace(/\s+/g, '');

  // // Handles special cases
  // const specialCases = /^((role)|(roll)|(pix)|(lulu))$/g;
  // if (normalizedMessage.match(specialCases)) {
  //   switch (normalizedMessage) {
  //     case 'role':
  //     case 'roll':
  //       botReply = await parseMessage('roll');
  //       break;
  //     case 'pix':
  //     case 'lulu':
  //       botReply = await parseMessage('pix');
  //       break;
  //     default:
  //   }
  //   return message.reply(botReply);
  // }

  // // General search cases
  // const championModel = new Champion(normalizedMessage);
  // const filteredChampions = await championModel.getChampions();

  // if (!filteredChampions || filteredChampions.length === 0) {
  //   botReply = await parseMessage('not-found');
  //   return message.reply(botReply);
  // }

  // // Find the exact match champion
  // const matchedChampion = filteredChampions.find(
  //   champion => champion.id.toLowerCase() === normalizedMessage
  // );

  // if (matchedChampion) {
  //   botReply = await parseMessage('found', matchedChampion);
  // } else {
  //   const possibleChampions = filteredChampions.map(
  //     (champion, index) => `${index + 1}. ${champion.name}`
  //   );
  //   const firstPart = await parseMessage('multiple');
  //   botReply = `${firstPart}${possibleChampions.join('\n')}`;
  // }

  // return message.reply(botReply);
});

client
  .login(process.env.CLIENT_TOKEN)
  .then(() => Logger.info('login-successfully', client.user))
  .catch(err => Logger.error('login-failed', err));
