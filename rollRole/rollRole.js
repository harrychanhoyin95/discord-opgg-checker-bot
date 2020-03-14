const roles = ['Top', 'Jungle', 'Support', 'AD', 'Middle'];

const getRandomInt = (min, max) => {
  const minValue = Math.ceil(min);
  const maxValue = Math.floor(max);
  return Math.floor(Math.random() * (maxValue - minValue)) + minValue;
};

const rollRole = () => `${roles[getRandomInt(0, roles.length)]}`;

module.exports = rollRole;
