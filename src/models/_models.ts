import { IGlobalStorage } from '@typings/i-typings';
import { ChampionsModel } from './champion';
import { GearModel } from './gear';

export interface IModels {
  champions: ChampionsModel;
  gear: GearModel;
}

export class Models {
  static getModels(storage: IGlobalStorage): IModels {
    const champions = new ChampionsModel(storage);
    const gear = new GearModel(storage, champions);

    return {
      champions,
      gear,
    };
  }
}
