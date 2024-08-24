import { CustomClient } from 'bot';
import {
    ModalSubmitInteraction
} from 'discord.js';

export default interface CustomModalInteraction {
    data: {
        name: string;
    };
    execute: (client: CustomClient, interaction: ModalSubmitInteraction) => Promise<void>;
}