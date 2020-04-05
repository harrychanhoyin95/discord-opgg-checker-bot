import { Logger } from '~storage/logger';
import { ICommand } from '~typings/i-typings';

export const addPlayer: ICommand = {
  name: 'addPlayer',
  description: 'Add player into the databse',
  async execute(message, args, models) {
    const reply = await models.player.create(args[0]);
    Logger.info('updatePlayer-command', null, { args });
    return message.channel.send(reply);
  },
};
