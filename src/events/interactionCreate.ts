import { BaseInteraction, ChatInputCommandInteraction, ContextMenuCommandInteraction, Events, InteractionType } from 'discord.js';
import CustomSlashCommandInteraction from 'interfaces/command';
import CustomContextMenuCommandInteraction from 'interfaces/contextMenu';
import { client } from '../bot';
import CustomButtonInteraction from 'interfaces/button';
import CustomModalInteraction from 'interfaces/modal';
import CustomStringSelectMenuInteraction from 'interfaces/selectMenu';

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
        } else if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId);

            try {
                if (!button) {
                    throw new Error(`No button matching ${interaction.customId} was found.`);
                }

                if (button.deferOptions) {
                    await interaction.deferReply(button.deferOptions);
                }

                await (button as CustomButtonInteraction).execute(client, interaction);
                
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this button!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this button!', ephemeral: true });
                }
            }

        } else if (interaction.isModalSubmit()) {
            const modal = client.modals.get(interaction.customId);

            try {
                if (!modal) {
                    throw new Error(`No modal matching ${interaction.customId} was found.`);
                }

                if (modal.deferOptions) {
                    await interaction.deferReply(modal.deferOptions);
                }

                await (modal as CustomModalInteraction).execute(client, interaction);
                
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this modal!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this modal!', ephemeral: true });
                }
            }

        } else if (interaction.isStringSelectMenu()) {
            const selectMenu = client.selectMenus.get(interaction.customId);

            try {
                if (!selectMenu) {
                    throw new Error(`No selectMenu matching ${interaction.customId} was found.`);
                }

                if (selectMenu.deferOptions) {
                    await interaction.deferReply(selectMenu.deferOptions);
                }

                await (selectMenu as CustomStringSelectMenuInteraction).execute(client, interaction);
                
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this selectMenu!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this selectMenu!', ephemeral: true });
                }
            }

        } else {
            console.error(`This event of type "${InteractionType[interaction.type]}" is not handle in interactionCreate event. InteractionId: ` + interaction);
        }
    }
};