import Discord from 'discord.js';
import { IModels, Models } from '~models/_models';
import { Shared } from '~models/_shared/_shared_models';
import { Logger } from '~storage/logger';
import { StorageBuilder } from '~storage/storage-builder';
import config from './config';
import { IStorage } from './typings/i-typings';

require('dotenv').config();

let models: IModels;
let globalStorage: IStorage;
StorageBuilder.getStorage(config).then((storage) => (globalStorage = storage));
const commands = Shared.commands.getCommands();
const client = new Discord.Client();

client.once('ready', () => {
  // Setup models with storage configs
  models = Models.getModels(globalStorage);
  Logger.info(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (message) => {
  if (!message?.content.startsWith(config.prefix) || message?.author.bot)
    return;

  // Split by spaces
  const args = message.content
    .toLowerCase()
    .slice(config.prefix.length)
    .split(/ +/);
  const command = args.shift().toLowerCase();

  if (!commands.has(command)) {
    Logger.info('no-command', null, { command });
    return message.reply(`Sorry, there is no ${command} command available.`);
  }

  try {
    commands.get(command).execute(message, args, models);
  } catch (error) {
    Logger.error('command-error', error, message.author, { command, args });
    return message.reply('There was an error trying to execute that command!');
  }
});

client
  .login(process.env.CLIENT_TOKEN)
  .then(() => Logger.info('login-successfully'))
  .catch((err) => Logger.error('login-failed', err.stack));
