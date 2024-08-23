import { Client, Events } from 'discord.js';

export default {
    name: Events.ClientReady,
    once: true,
    execute: async (client: Client) => {
        if (!client.user || !client.application) {
            return;
        }

        console.log(`=> ${client.user.username} is online!`);
    }
};