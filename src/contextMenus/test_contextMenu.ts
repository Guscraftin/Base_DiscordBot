import {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    ContextMenuCommandInteraction,
    PermissionFlagsBits 
} from 'discord.js';
import { CustomClient } from 'bot';

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('test user')
        .setType(ApplicationCommandType.User)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    deferOptions: { ephemeral: true },
    async execute(client: CustomClient, interaction: ContextMenuCommandInteraction) {
        return await interaction.editReply({ content: "Here's a test contextual menu that works properly!" });
    }
}