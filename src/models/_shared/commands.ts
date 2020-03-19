import { ICommand } from '@typings/i-typings';
import Discord from 'discord.js';
import fs from 'fs';
import path from 'path';

export class Commands {
  static getCommands() {
    const commands = new Discord.Collection<string, ICommand>();

    // Reads command files
    const commandFiles = fs
      .readdirSync(path.resolve(process.cwd(), './src/commands'))
      .filter(file => file.endsWith('.js') || file.endsWith('.ts'));

    // Setup available commands
    for (const file of commandFiles) {
      const command: {
        [key: string]: ICommand;
      } = require(path.resolve(process.cwd(), `./src/commands/${file}`));
      const [[name, commandInfo]] = Object.entries(command);
      commands.set(name, commandInfo);
    }

    return commands;
  }
}
