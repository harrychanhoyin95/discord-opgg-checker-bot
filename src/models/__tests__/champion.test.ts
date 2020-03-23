import fetchMock from 'jest-fetch-mock';
import { IModels, Models } from '~models/_models';
import { getMockStorage, IMockStorage } from '~tests/_mock';
import { ChampionsModel } from '../champion';
import { championsResponse, mockVersion } from '../__mocks__/champions';

describe('Champion Model', () => {
  let models: IModels;
  let storage: IMockStorage;
  let champions: ChampionsModel;

  beforeEach(() => {
    storage = getMockStorage();
    models = Models.getModels(storage);
    champions = models.champions;
    fetchMock.resetMocks();
  });

  describe('genChampions', () => {
    beforeEach(() => {
      champions.getLatestVersionNumber = jest
        .fn()
        .mockResolvedValueOnce(mockVersion);
      fetchMock.mockResponseOnce(JSON.stringify({ data: championsResponse }));
    });

    it('should return a champion if matched', async () => {
      const response = await champions.genChampions(null, 'bgor');

      expect(response).toEqual([
        {
          id: 'bGor',
          image: { full: 'image' },
          name: 'BGod',
          title: 'CEO of AATrip',
        },
      ]);

      expect(fetchMock).toHaveBeenCalledWith(
        `${storage.config.ddragon.cdnUrl}/${mockVersion}/data/en_US/champion.json`,
      );
    });

    it('should return multiple champions with same starting characters', async () => {
      const response = await champions.genChampions(null, 'bg');

      expect(response).toEqual([
        {
          id: 'bGor',
          image: { full: 'image' },
          name: 'BGod',
          title: 'CEO of AATrip',
        },
        {
          id: 'bGuy',
          name: 'BGuy',
          title: 'COO of AATrip',
          image: {
            full: 'image',
          },
        },
      ]);

      expect(fetchMock).toHaveBeenCalledWith(
        `${storage.config.ddragon.cdnUrl}/${mockVersion}/data/en_US/champion.json`,
      );
    });
  });

  describe('getLatestVersionNumber', () => {
    it('should return version number', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: [mockVersion] }));

      const versionResponse = await champions.getLatestVersionNumber();

      expect(versionResponse).toEqual(mockVersion);
      expect(fetchMock).toHaveBeenCalledWith(
        `${storage.config.ddragon.apiUrl}/versions.json`,
      );
    });
  });
});
