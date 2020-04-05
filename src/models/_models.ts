import { IStorage } from '~typings/i-typings';
import { ChampionsModel } from './champion';
import { GearModel } from './gear';
import { PlayerModel } from './player';

export interface IModels {
  champions: ChampionsModel;
  gear: GearModel;
  player: PlayerModel;
}

export class Models {
  static getModels(storage: IStorage): IModels {
    // Inject dependencies to each model as needed
    const champions = new ChampionsModel(storage);
    const gear = new GearModel(storage, champions);
    const player = new PlayerModel(storage);

    return {
      champions,
      gear,
      player,
    };
  }
}
