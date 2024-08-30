import { ButtonInteraction } from 'discord.js';
import CustomBaseInteraction from './baseInteraction';
import { CustomClient } from 'bot';

export default interface CustomButtonInteraction extends CustomBaseInteraction {
    data: {
        name: string;
    };
    execute: (client: CustomClient, interaction: ButtonInteraction) => Promise<void>;
}