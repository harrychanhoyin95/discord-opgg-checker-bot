import { Logger } from '~storage/logger';
import { ICommand } from '~typings/i-typings';

export const updatePlayer: ICommand = {
  name: 'updatePlayer',
  description: 'Update the list of winner in all minigames',
  async execute(message, args, models) {
    const reply = await models.player.update(args[0], args[1]);
    Logger.info('updatePlayer-command', null, { args });
    return message.channel.send(reply);
  },
};
