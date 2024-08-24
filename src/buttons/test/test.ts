import { CustomClient } from "bot";
import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ButtonInteraction, ModalActionRowComponentBuilder } from "discord.js";

module.exports = {
    data: {
        name: "test",
    },
    async execute(client: CustomClient, interaction: ButtonInteraction) {
        const modal = new ModalBuilder()
            .setCustomId("test_modal")
            .setTitle("Tester les modals !");

        const newNameInput = new TextInputBuilder()
            .setCustomId("newTest")
            .setLabel("Ce test est concluant ?")
            .setMinLength(1)
            .setMaxLength(32)
            .setPlaceholder("Tape ta réponse ici !")
            .setStyle(TextInputStyle.Short);

        modal.addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(newNameInput));

        return interaction.showModal(modal);
    }
}