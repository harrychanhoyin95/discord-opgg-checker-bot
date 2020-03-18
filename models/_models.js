const ChampionsModel = require('./champion');
const GearModel = require('./gear');

module.exports = class Models {
  static getModels(storage) {
    const champions = new ChampionsModel(storage);
    const gear = new GearModel(storage, champions);

    return {
      champions,
      gear,
    };
  }
};
