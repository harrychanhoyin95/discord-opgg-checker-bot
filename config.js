const config = {
  prefix: '!',
  ddragon: {
    cdnUrl: `https://ddragon.leagueoflegends.com/cdn`,
    apiUrl: `https://ddragon.leagueoflegends.com/api`,
  },
  opGG: {
    statUrl: name => `https://www.op.gg/champion/${name}/statistics`,
  },
};

module.exports = config;
