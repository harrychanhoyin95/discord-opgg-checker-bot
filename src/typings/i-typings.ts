import { IModels } from '@models/_models';
import Discord from 'discord.js';

export interface IGlobalStorage {
  config: IConfig;
}

export interface IConfig {
  prefix: string;
  ddragon: {
    apiUrl: string;
    cdnUrl: string;
  };
  opGG: {
    statUrl(name: string): string;
  };
}

export interface ICommand {
  name: string;
  description: string;
  execute(
    message: Discord.Message | Discord.PartialMessage,
    args: string[],
    models: IModels
  ): void;
}
