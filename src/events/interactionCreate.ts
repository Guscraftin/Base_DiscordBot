import { BaseInteraction, ChatInputCommandInteraction, ContextMenuCommandInteraction, Events } from 'discord.js';
import CustomSlashCommandInteraction from 'interfaces/command';
import CustomContextMenuCommandInteraction from 'interfaces/contextMenus';
import { client } from '../bot';

// Type guard for CustomContextMenuCommandInteraction
function isContextMenuCommandInteraction(interaction: any): interaction is ContextMenuCommandInteraction {
    return interaction instanceof ContextMenuCommandInteraction;
}

// Type guard for CustomSlashCommandInteraction
function isSlashCommandInteraction(interaction: any): interaction is ChatInputCommandInteraction {
    return interaction instanceof ChatInputCommandInteraction;
}

/**
 * DEFAULT EVENT OBJECT
 */
export default {
    name: Events.InteractionCreate,
    execute: async (interaction: BaseInteraction) => {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName) || client.contextMenus.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                if (command.deferOptions) {
                    await interaction.deferReply(command.deferOptions);
                }

                if (isContextMenuCommandInteraction(interaction)) {
                    await (command as CustomContextMenuCommandInteraction).execute(client, interaction);
                } else if (isSlashCommandInteraction(interaction)) {
                    await (command as CustomSlashCommandInteraction).execute(client, interaction);
                } else {
                    throw new Error("This command interaction is not valid: " + interaction);
                }
                
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        } else {
            console.error("This event is not a command: " + interaction);
        }
    }
};