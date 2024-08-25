import CustomBaseInteraction from './baseInteraction';
import { CustomClient } from 'bot';
import {
    ContextMenuCommandBuilder,
    ContextMenuCommandInteraction
} from 'discord.js';

export default interface CustomContextMenuCommandInteraction extends CustomBaseInteraction {
    data: ContextMenuCommandBuilder;
    execute: (client: CustomClient, interaction: ContextMenuCommandInteraction) => Promise<void>;
}