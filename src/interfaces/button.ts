import CustomBaseInteraction from './baseInteraction';
import { CustomClient } from 'bot';
import {
    ButtonInteraction,
} from 'discord.js';

export default interface CustomButtonInteraction extends CustomBaseInteraction {
    data: {
        name: string;
    };
    execute: (client: CustomClient, interaction: ButtonInteraction) => Promise<void>;
}