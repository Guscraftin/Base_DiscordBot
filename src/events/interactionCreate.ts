import CustomSlashCommandInteraction from 'interfaces/command';
import CustomContextMenuCommandInteraction from 'interfaces/contextMenu';
import CustomButtonInteraction from 'interfaces/button';
import CustomModalInteraction from 'interfaces/modal';
import CustomStringSelectMenuInteraction from 'interfaces/selectMenu';
import CustomBaseInteraction from 'interfaces/baseInteraction';
import { client } from '../bot';
import {
    ApplicationCommandType,
    BaseInteraction,
    ButtonInteraction,
    ChatInputCommandInteraction,
    ContextMenuCommandInteraction,
    Events,
    InteractionType,
    ModalSubmitInteraction,
    StringSelectMenuInteraction
} from 'discord.js';

function checkPermissions(interaction: BaseInteraction, botInteraction: CustomBaseInteraction): string | void {
    if (!botInteraction.botPermissions) return;
    if (!interaction.appPermissions) {
        return 'The bot lacks permissions. Please contact an administrator of this server.';
    }

    const missingPermissions = interaction.appPermissions.missing(botInteraction.botPermissions);
    if (missingPermissions.length) {
        return `Here are the permissions the bot needs to correctly execute your interaction: \`${missingPermissions.join('\`, \`')}\``;
    }
}

async function handleCommandInteraction(interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction) {
    const command = client.commands.get(interaction.commandName) || client.contextMenus.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {        
        const returnPermission = checkPermissions(interaction, command);
        if (returnPermission) return interaction.reply({ content: returnPermission, ephemeral: true });
        if (command.deferOptions) await interaction.deferReply(command.deferOptions);

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
            await interaction.editReply({ content: 'There was an error while executing this command!' });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}

function isContextMenuCommandInteraction(interaction: any): interaction is ContextMenuCommandInteraction {
    return interaction instanceof ContextMenuCommandInteraction;
}

function isSlashCommandInteraction(interaction: any): interaction is ChatInputCommandInteraction {
    return interaction instanceof ChatInputCommandInteraction;
}

async function handleContextMenuCommandInteraction(interaction: ContextMenuCommandInteraction) {
    await handleCommandInteraction(interaction);
}

async function handleSlashCommandInteraction(interaction: ChatInputCommandInteraction) {
    await handleCommandInteraction(interaction);
}

async function handleButtonInteraction(interaction: ButtonInteraction) {
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
}

async function handleModalInteraction(interaction: ModalSubmitInteraction) {
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
}

async function handleSelectMenuInteraction(interaction: StringSelectMenuInteraction) {
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
}

export default {
    name: Events.InteractionCreate,
    execute: async (interaction: BaseInteraction) => {
        if (interaction.isCommand()) {
            if (interaction.commandType === ApplicationCommandType.ChatInput)
                await handleSlashCommandInteraction(interaction as ChatInputCommandInteraction);
            else
                await handleContextMenuCommandInteraction(interaction as ContextMenuCommandInteraction);
        } else if (interaction.isButton()) {
            await handleButtonInteraction(interaction);
        } else if (interaction.isModalSubmit()) {
            await handleModalInteraction(interaction);
        } else if (interaction.isStringSelectMenu()) {
            await handleSelectMenuInteraction(interaction);
        } else {
            console.error(`This event of type "${InteractionType[interaction.type]}" is not handled in interactionCreate event. InteractionId: ` + interaction);
        }
    }
};