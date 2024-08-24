import { Client, Collection } from 'discord.js';
import { deployCommands } from './utils/deploy-commands';
import CustomButtonInteraction from 'interfaces/button';
import CustomContextMenuCommandInteraction from 'interfaces/contextMenu';
import CustomModalInteraction from 'interfaces/modal';
import CustomSlashCommandInteraction from 'interfaces/command';
import CustomStringSelectMenuInteraction from 'interfaces/selectMenu';
import dotenv from 'dotenv';
dotenv.config();


console.log("Bot is starting...");

export interface CustomClient extends Client {
    buttons: Collection<string, CustomButtonInteraction>;
    commands: Collection<string, CustomSlashCommandInteraction>;
    contextMenus: Collection<string, CustomContextMenuCommandInteraction>;
    modals: Collection<string, CustomModalInteraction>;
    selectMenus: Collection<string, CustomStringSelectMenuInteraction>;
}

export const client: CustomClient = new Client({
    intents: []
}) as CustomClient;
client.buttons = new Collection();
client.commands = new Collection();
client.contextMenus = new Collection();
client.modals = new Collection();
client.selectMenus = new Collection();

async function loadHandlers() {
    const handlers = ['buttons', 'commands', 'contextMenus', 'events', 'modals', 'selectMenus'];

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