const Logger = require('../storage/logger');

const gear = {
  name: 'gear',
  description: 'Gets the recommended gears of a champion',
  async execute(message, args, models) {
    const reply = await models.gear.gen(message.author, args[0]);
    Logger.info('gear-command', null, { args });
    return message.channel.send(reply);
  },
};

module.exports = gear;
