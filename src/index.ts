import { Client, Events, GatewayIntentBits } from 'discord.js';
import { readdir, readdirSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';
import { Command } from './types';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
});

const commandsDir = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsDir).filter(file => file.endsWith('.js'));

const commands = new Map<string, Command>();
for (const file of commandFiles) {
  const commandPath = join(commandsDir, file);
  import(commandPath).then(({ command }) => {
    const name = command.data.name;
    if (command && name) {
      commands.set(name, command);
    }
  }).catch(console.error);
}

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = commands.get(interaction.commandName);
  if (command) {
    try {
      await command.run(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

const token = process.env.TOKEN;
if (!token) {
  throw new Error('TOKEN is not defined in the environment variables');
}

client.login(token);