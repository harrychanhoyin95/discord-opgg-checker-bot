const roles = [
  'Top',
  'Jungle',
  'Support',
  'AD',
  'Middle',
];

const getRandomInt = (min, max) => {
  const minValue = Math.ceil(min);
  const maxValue = Math.floor(max);
  return Math.floor(Math.random() * (maxValue - minValue)) + minValue;
};

const rollRole = (message) => message.reply(`${roles[getRandomInt(0, 5)]}`);

module.exports = rollRole;
