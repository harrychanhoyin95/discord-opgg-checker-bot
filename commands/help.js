const Logger = require('../storage/logger');

const help = {
  name: 'help',
  description: 'List out available commands',
  execute(message, _args, _models) {
    const listOfCommands = Array.from(message.client.commands)
      .map(([name, config]) => `${name} - ${config.description}`)
      .sort((a, b) => a - b);

    Logger.info('help-command');

    return message.channel.send(
      `List of commands:\n--------------------\n${listOfCommands.join('\n')}`
    );
  },
};

module.exports = help;
