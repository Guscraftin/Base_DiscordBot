import { CustomClient } from 'bot';
import {
    StringSelectMenuInteraction,
} from 'discord.js';

export default interface CustomStringSelectMenuInteraction {
    data: {
        name: string;
    };
    execute: (client: CustomClient, interaction: StringSelectMenuInteraction) => Promise<void>;
}