import { CustomClient } from 'bot';
import {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    ContextMenuCommandInteraction,
    PermissionFlagsBits 
} from 'discord.js';

module.exports = {
    deferOptions: { ephemeral: true },
    data: new ContextMenuCommandBuilder()
        .setName('test user')
        .setType(ApplicationCommandType.User)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(client: CustomClient, interaction: ContextMenuCommandInteraction) {
        return interaction.editReply({ content: "Here's a test contextual menu that works properly!" });
    }
}