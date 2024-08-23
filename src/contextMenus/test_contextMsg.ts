import { CustomClient } from 'bot';
import { 
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    ContextMenuCommandInteraction,
    PermissionFlagsBits,
} from 'discord.js';

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Test msg')
        .setType(ApplicationCommandType.Message)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(client: CustomClient, interaction: ContextMenuCommandInteraction) {
        return interaction.reply({ content: "Voici le message test qui fonctionne correctement !", ephemeral: true})
    }
}