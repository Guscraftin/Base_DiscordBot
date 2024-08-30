import { CustomClient } from 'bot';
import { ChatInputCommandInteraction, EmbedBuilder, User, Team, SlashCommandBuilder } from 'discord.js';

export = {
    deferOptions: { ephemeral: false },
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Display bot information.")
        .setDMPermission(true),
    async execute(client: CustomClient, interaction: ChatInputCommandInteraction) {
        const botUser = interaction.client.user;
        const owners = await getOwnersList(interaction);
        const embed = createBotInfoEmbed(botUser, interaction, owners);

        return interaction.editReply({ embeds: [embed] });
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
        .setTitle('Bot information:')
        .setAuthor({ name: botUser.username, iconURL: botUser.displayAvatarURL() })
        .setThumbnail(botUser.displayAvatarURL())
        .setURL('https://apprendre-discord.fr')
        .setDescription("I was created to help as many people as possible on discord.")
        .addFields(
            { name: 'Creation date:', value: `<t:${Math.floor(botUser.createdTimestamp / 1000)}:R>`, inline: true },
            { name: 'Online since', value: `<t:${Math.floor(interaction.client.readyTimestamp / 1000)}:f>`, inline: true },
            { name: 'Owner(s):', value: owners, inline: true },
            { name: 'My developers:', value: `▸ [Guscraftin](https://github.com/Guscraftin)`, inline: true },
        )
        .setColor('DarkAqua')
        .setTimestamp()
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });
}