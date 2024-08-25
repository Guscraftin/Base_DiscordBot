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
                return interaction.editReply({ content: "Vous avez choisi la première option !" });
            case "second_option":
                return interaction.editReply({ content: "Vous avez choisi la deuxième option !" });
            default:
                return interaction.editReply({ content: "Vous n'avez pas choisi d'option !" });
        }
    }
}