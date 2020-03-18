const Discord = require('discord.js');
const fs = require('fs');
const StorageBuilder = require('./storage/storage-builder');
const Logger = require('./storage/logger');
const Models = require('./models/_models');
const config = require('./config');

require('dotenv').config();

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
});

client
  .login(process.env.CLIENT_TOKEN)
  .then(() => Logger.info('login-successfully', client.user))
  .catch(err => Logger.error('login-failed', err));
