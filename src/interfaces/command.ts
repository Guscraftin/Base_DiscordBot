import { CustomClient } from 'bot';
import {
    ChatInputCommandInteraction, 
    SlashCommandBuilder
} from 'discord.js';

export default interface CustomSlashCommandInteraction {
    deferOptions?: { ephemeral: boolean };
    data: SlashCommandBuilder;
    execute: (client: CustomClient, interaction: ChatInputCommandInteraction) => Promise<void>;
}