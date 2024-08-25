import CustomBaseInteraction from './baseInteraction';
import { CustomClient } from 'bot';
import {
    ChatInputCommandInteraction, 
    SlashCommandBuilder
} from 'discord.js';

export default interface CustomSlashCommandInteraction extends CustomBaseInteraction {
    data: SlashCommandBuilder;
    execute: (client: CustomClient, interaction: ChatInputCommandInteraction) => Promise<void>;
}