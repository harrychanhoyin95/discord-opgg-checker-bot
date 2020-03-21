import Discord from 'discord.js';
import fs from 'fs';
import { ICommand } from '~typings/i-typings';

export class Commands {
  static getCommands(): Discord.Collection<string, ICommand> {
    const commands = new Discord.Collection<string, ICommand>();

    // Reads command files
    const commandFiles = fs
      .readdirSync(`${__dirname}/../../commands`)
      .filter((file) => file.endsWith('.js') || file.endsWith('.ts'));

    // Setup available commands
    for (const file of commandFiles) {
      const command: {
        [key: string]: ICommand;
        // eslint-disable-next-line @typescript-eslint/no-var-requires
      } = require(`../../commands/${file}`);
      const [[name, commandInfo]] = Object.entries(command);
      commands.set(name.toLowerCase(), commandInfo);
    }

    return commands;
  }
}
