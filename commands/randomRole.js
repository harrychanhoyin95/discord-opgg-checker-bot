const Logger = require('../storage/logger');

const roles = ['Top', 'Jungle', 'Support', 'AD', 'Middle'];
const getRandomInt = (min, max) => {
  const minValue = Math.ceil(min);
  const maxValue = Math.floor(max);
  return Math.floor(Math.random() * (maxValue - minValue)) + minValue;
};

const randomRole = {
  name: 'randomrole',
  description: 'Get a random role',
  execute(message, _args, _models) {
    const role = `${roles[getRandomInt(0, roles.length)]}`;
    Logger.info('random-role-command');
    return message.channel.send(role);
  },
};

module.exports = randomRole;
