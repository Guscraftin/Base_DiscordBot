import { CustomClient } from 'bot';
import {
    ButtonInteraction,
} from 'discord.js';

export default interface CustomButtonInteraction {
    data: {
        name: string;
    };
    execute: (client: CustomClient, interaction: ButtonInteraction) => Promise<void>;
}