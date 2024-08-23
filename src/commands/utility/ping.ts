import { CustomClient } from 'bot';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import CustomSlashCommandInteraction from 'interfaces/command';

const pingCommand: CustomSlashCommandInteraction = {
    deferOptions: { ephemeral: true },
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!")
        .setDMPermission(false),
    execute: async (client: CustomClient, interaction: ChatInputCommandInteraction) => {
        const content: string = "Pong!";
        try {
            await interaction.followUp({ content });
        } catch (error) {
            console.error("[Hello] Failed to send reply:", error);
        }
    }
};

export default pingCommand;