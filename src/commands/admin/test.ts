import { CustomClient } from "bot";
import { ChatInputCommandInteraction } from "discord.js";
import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from 'discord.js';

module.exports = {
    botPermissions: [PermissionFlagsBits.Administrator, PermissionFlagsBits.ManageRoles],
    deferOptions: { ephemeral: true },
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Allows you to test individual components.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(client: CustomClient, interaction: ChatInputCommandInteraction) {
        const buttonRow = createButtonRow();
        const selectMenuRow = createSelectMenuRow();
        const embed = createEmbed(interaction);

        await interaction.editReply({
            content: 'Component testing',
            embeds: [embed],
            components: [buttonRow, selectMenuRow]
        });
    },
};

function createButtonRow(): ActionRowBuilder<ButtonBuilder> {
    return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('test')
                .setLabel('Launch the modal!')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🚧'),
        );
}

function createSelectMenuRow(): ActionRowBuilder<StringSelectMenuBuilder> {
    return new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('test_selectMenu')
                .setPlaceholder('Select an option')
                .addOptions(
                    {
                        label: 'Choose me',
                        description: 'Here\'s a description',
                        value: 'first_option',
                    },
                    {
                        label: 'Choose me too',
                        description: 'Here\'s another description',
                        value: 'second_option',
                    },
                ),
        );
}

function createEmbed(interaction: ChatInputCommandInteraction): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle('Embed Test')
        .setDescription("Here's a button to answer a sentence.")
        .setColor('DarkAqua')
        .setTimestamp()
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });
}