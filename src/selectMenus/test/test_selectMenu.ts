import { PermissionFlagsBits, StringSelectMenuInteraction } from "discord.js";
import { CustomClient } from "bot";

module.exports = {
    botPermissions: [PermissionFlagsBits.AttachFiles],
    data: {
        name: "test_selectMenu",
    },
    deferOptions: { ephemeral: true },
    async execute(client: CustomClient, interaction: StringSelectMenuInteraction) {
        const first = 0;
        switch (interaction.values[first]) {
            case "first_option":
                return await interaction.editReply({ content: "You chose the first option!" });
            case "second_option":
                return await interaction.editReply({ content: "You chose the second option!" });
            default:
                return await interaction.editReply({ content: "You haven't chosen an option!" });
        }
    }
}