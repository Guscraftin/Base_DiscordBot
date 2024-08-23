import { CustomClient } from 'bot';
import {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    ContextMenuCommandInteraction,
    PermissionFlagsBits 
} from 'discord.js';

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('test user')
        .setType(ApplicationCommandType.User)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(client: CustomClient, interaction: ContextMenuCommandInteraction) {
        return interaction.reply({ content: "Voici le menu contextuel test qui fonctionne correctement !", ephemeral: true})
    }
}