import { CustomClient } from "bot";
import { ModalSubmitInteraction } from "discord.js";

export = {
    data: {
        name: "test_modal",
    },
    async execute(client: CustomClient, interaction: ModalSubmitInteraction) {
        const newTest = interaction.fields?.getTextInputValue("newTest");
        
        return interaction.reply({ content: `Le bouton et le modal sont concluant : \`${newTest}\``, ephemeral: true});
    }
}