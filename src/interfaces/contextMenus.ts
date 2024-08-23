import { CustomClient } from 'bot';
import {
    ContextMenuCommandBuilder,
    ContextMenuCommandInteraction
} from 'discord.js';

export default interface CustomContextMenuCommandInteraction {
    deferOptions?: { ephemeral: boolean };
    data: ContextMenuCommandBuilder;
    execute: (client: CustomClient, interaction: ContextMenuCommandInteraction) => Promise<void>;
}