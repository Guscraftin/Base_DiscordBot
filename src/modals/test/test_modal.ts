import { CustomClient } from "bot";
import { ModalSubmitInteraction } from "discord.js";

export = {
    deferOptions: { ephemeral: true },
    data: {
        name: "test_modal",
    },
    async execute(client: CustomClient, interaction: ModalSubmitInteraction) {
        const newTest = interaction.fields?.getTextInputValue("newTest");
        
        return interaction.editReply({ content: `Button and modal are conclusive: \`${newTest}\`` });
    }
}