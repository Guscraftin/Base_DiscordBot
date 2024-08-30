import { CustomClient } from "bot";
import { ModalSubmitInteraction } from "discord.js";

export = {
    data: {
        name: "test_modal",
    },
    deferOptions: { ephemeral: true },
    async execute(client: CustomClient, interaction: ModalSubmitInteraction) {
        const newTest = interaction.fields?.getTextInputValue("newTest");
        
        return await interaction.editReply({ content: `Button and modal are conclusive: \`${newTest}\`` });
    }
}