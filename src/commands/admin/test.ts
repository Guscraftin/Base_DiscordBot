import { CustomClient } from "bot";
import { ChatInputCommandInteraction } from "discord.js";
import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Permet de tester les différents composants.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(client: CustomClient, interaction: ChatInputCommandInteraction) {
        const buttonRow = createButtonRow();
        const selectMenuRow = createSelectMenuRow();
        const embed = createEmbed(interaction);

        await interaction.reply({
            content: 'Test des composants',
            ephemeral: true,
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
                .setLabel('Lancer le modal !')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🚧'),
        );
}

function createSelectMenuRow(): ActionRowBuilder<StringSelectMenuBuilder> {
    return new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('test_selectMenu')
                .setPlaceholder('Sélectionnez une option')
                .addOptions(
                    {
                        label: 'Choisissez-moi',
                        description: 'Voici une description',
                        value: 'first_option',
                    },
                    {
                        label: 'Choisissez-moi aussi',
                        description: 'Voici une autre description',
                        value: 'second_option',
                    },
                ),
        );
}

function createEmbed(interaction: ChatInputCommandInteraction): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle('Embed Test')
        .setDescription("Voici un bouton ci dessous qui doit répondre une phrase.")
        .setColor('DarkAqua')
        .setTimestamp()
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });
}