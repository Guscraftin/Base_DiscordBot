import { Client, Events } from 'discord.js';

export default {
    execute: (client: Client) => {
        if (!client.user || !client.application) {
            return;
        }
        
        console.log(`=> ${client.user.username} is online!`);
    },
    name: Events.ClientReady,
    once: true,
};