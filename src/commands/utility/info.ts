import { CustomClient } from 'bot';
import { ChatInputCommandInteraction, EmbedBuilder, User, Team, SlashCommandBuilder } from 'discord.js';

export = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Afficher les informations du bot.")
        .setDMPermission(true),
    async execute(client: CustomClient, interaction: ChatInputCommandInteraction) {
        const botUser = interaction.client.user;
        const owners = await getOwnersList(interaction);
        const embed = createBotInfoEmbed(botUser, interaction, owners);

        return interaction.reply({ embeds: [embed] });
    },
};

async function getOwnersList(interaction: ChatInputCommandInteraction): Promise<string> {
    let owners = "Aucun";
    await interaction.client.application.fetch().then(bot => {
        if ((bot.owner as User)?.username !== undefined) {
            owners = `▸ [${(bot.owner as User).username}](https://discord.com/users/${(bot.owner as User).id})`;
        } else if (bot.owner instanceof Team) {
            owners = bot.owner.members.map(member => `▸ [${member.user.username}](https://discord.com/users/${member.user.id})`).join('\n');
        }
    });
    return owners;
}

function createBotInfoEmbed(botUser: User, interaction: ChatInputCommandInteraction, owners: string): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle('Information sur le bot :')
        .setAuthor({ name: botUser.username, iconURL: botUser.displayAvatarURL() })
        .setThumbnail(botUser.displayAvatarURL())
        .setURL('https://apprendre-discord.fr')
        .setDescription("J'ai été créé dans le but d'aider un maximum de personne sur discord.")
        .addFields(
            { name: 'Date de création', value: `<t:${Math.floor(botUser.createdTimestamp / 1000)}:R>`, inline: true },
            { name: 'En ligne depuis', value: `<t:${Math.floor(interaction.client.readyTimestamp / 1000)}:f>`, inline: true },
            { name: 'Propriétaire(s) :', value: owners, inline: true },
            { name: 'Mes développeurs :', value: `▸ [Guscraftin](https://github.com/Guscraftin)`, inline: true },
        )
        .setColor('DarkAqua')
        .setTimestamp()
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });
}