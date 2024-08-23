import { Client, Collection } from 'discord.js';
import CustomSlashCommandInteraction from 'interfaces/command';
import CustomContextMenuCommandInteraction from 'interfaces/contextMenus';
import { deployCommands } from './utils/deploy-commands';
import dotenv from 'dotenv';
dotenv.config();


console.log("Bot is starting...");

export interface CustomClient extends Client {
    commands: Collection<string, CustomSlashCommandInteraction>;
    contextMenus: Collection<string, CustomContextMenuCommandInteraction>;
}

export const client: CustomClient = new Client({
    intents: []
}) as CustomClient;
client.commands = new Collection();
client.contextMenus = new Collection();

async function loadHandlers() {
    const handlers = ['commands', 'contextMenus', 'events'];

    for (const handler of handlers) {
        try {
            const module = await import(`./handlers/${handler}`);
            await module.default(client);
        } catch (error) {
            console.error(`Error loading handler "${handler}":`, error);
        }
    }
};

(async function loadBot() {
    await loadHandlers(); 
    await deployCommands(client);
})();

client.login(process.env.DISCORD_TOKEN);