import { IModels, Models } from '~models/_models';
import { getMockStorage, IMockStorage } from '~tests/_mock';
import { ChampionsModel } from '../champion';
import { GearModel } from '../gear';
import { mockChampions, mockVersion } from '../__mocks__/champions';

describe('Gear Model', () => {
  let models: IModels;
  let storage: IMockStorage;
  let gear: GearModel;
  let champions: ChampionsModel;

  beforeEach(() => {
    storage = getMockStorage();
    models = Models.getModels(storage);
    gear = models.gear;
    champions = models.champions;
    gear.parseMessage = jest.fn();
    fetchMock.resetMocks();
  });

  it('should return empty reply', async () => {
    await gear.gen(null, '');
    expect(gear.parseMessage).toHaveBeenCalledWith('empty');
  });

  it('should return special pix case reply', async () => {
    await gear.gen(null, 'pix');
    expect(gear.parseMessage).toHaveBeenCalledWith('pix');
  });

  it('should return not found reply', async () => {
    champions.genChampions = jest.fn().mockResolvedValueOnce([]);
    await gear.gen(null, 'bard');
    expect(gear.parseMessage).toHaveBeenCalledWith('not-found');
  });

  it('should return multiple reply', async () => {
    champions.getLatestVersionNumber = jest
      .fn()
      .mockResolvedValueOnce(mockVersion);
    champions.genChampions = jest.fn().mockResolvedValueOnce(mockChampions);

    await gear.gen(null, 'bg');

    expect(gear.parseMessage).toHaveBeenCalledWith('multiple');
  });

  it('should return found reply', async () => {
    champions.getLatestVersionNumber = jest
      .fn()
      .mockResolvedValueOnce(mockVersion);
    champions.genChampions = jest.fn().mockResolvedValueOnce(mockChampions);

    await gear.gen(null, 'bgor');

    expect(gear.parseMessage).toHaveBeenCalledWith(
      'found',
      mockChampions[0],
      mockVersion,
    );
  });
});
