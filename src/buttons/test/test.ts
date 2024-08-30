import { CustomClient } from "bot";
import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ButtonInteraction, ModalActionRowComponentBuilder } from "discord.js";

module.exports = {
    data: {
        name: "test",
    },
    async execute(client: CustomClient, interaction: ButtonInteraction) {
        const modal = new ModalBuilder()
            .setCustomId("test_modal")
            .setTitle("Testing modals!");

        const newNameInput = new TextInputBuilder()
            .setCustomId("newTest")
            .setLabel("Is this test conclusive?")
            .setMinLength(1)
            .setMaxLength(32)
            .setPlaceholder("Type your answer here!")
            .setStyle(TextInputStyle.Short);

        modal.addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(newNameInput));

        return interaction.showModal(modal);
    }
}