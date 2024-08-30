import { CustomClient } from "bot";
import { StringSelectMenuInteraction } from "discord.js";

module.exports = {
    deferOptions: { ephemeral: true },
    data: {
        name: "test_selectMenu",
    },
    async execute(client: CustomClient, interaction: StringSelectMenuInteraction) {
        switch (interaction.values[0]) {
            case "first_option":
                return interaction.editReply({ content: "You chose the first option!" });
            case "second_option":
                return interaction.editReply({ content: "You chose the second option!" });
            default:
                return interaction.editReply({ content: "You haven't chosen an option!" });
        }
    }
}