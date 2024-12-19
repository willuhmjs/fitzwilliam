import { readdirSync } from 'fs';
import { join } from 'path';
import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { Command, CommandSchema } from './types';

dotenv.config();

const commandsDir = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsDir).filter(file => file.endsWith('.js'));

const commands = [];

for (const file of commandFiles) {
  console.log(`Processing command file: ${file}`);
  const commandPath = join(commandsDir, file);
  console.log(`Command path: ${commandPath}`);
  const command: Command = require(commandPath).command;
  console.log(`Loaded command: ${JSON.stringify(command)}`);

  const parsedCommand = CommandSchema.safeParse(command);
  if (parsedCommand.success) {
    console.log(`Command ${file} parsed successfully.`);
    if (process.env.DEV_GUILD) {
      console.log(`DEV_GUILD is set. Modifying command description for development.`);
      command.data.setDescription(`(DEV) ${command.data.description}`);
    }
    commands.push(command.data.toJSON());
    console.log(`Command ${file} added to commands array.`);
  } else {
    console.warn(`Command file ${file} is missing required properties and will be skipped.`);
  }
}

const token = process.env.TOKEN;
if (!token) {
  throw new Error('TOKEN is not defined in the environment variables');
}
const clientId = process.env.CLIENT_ID;
if (!clientId) {
  throw new Error('CLIENT_ID is not defined in the environment variables');
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        if (process.env.DEV_GUILD) {
          const response = await rest.put(
            Routes.applicationGuildCommands(clientId, process.env.DEV_GUILD),
            { body: commands }
          )   
          console.log(response);

        } else {
          const response = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands }
        );
        console.log(response);

      }

        

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        throw new Error('Failed to refresh application (/) commands.');
    }
})();
