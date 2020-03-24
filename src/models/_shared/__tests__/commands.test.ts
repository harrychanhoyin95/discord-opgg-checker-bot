import * as commandFiles from '~commands/_commands';
import { Shared } from '../_shared_models';

describe('Shared Commands', () => {
  const commandsModel = Shared.commands;

  it('should return available commands', () => {
    const result = commandsModel.getCommands();
    expect(Array.from(result)).toHaveLength(Object.keys(commandFiles).length);
  });
});
