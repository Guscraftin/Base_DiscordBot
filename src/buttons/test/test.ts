import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { CustomClient } from "bot";

export default {
  data: {
    name: "test",
  },
  async execute(client: CustomClient, interaction: ButtonInteraction) {
    const modal = new ModalBuilder()
      .setCustomId("test_modal")
      .setTitle("Testing modals!");

    const minCharacters = 1;
    const maxCharacters = 32;
    const newNameInput = new TextInputBuilder()
      .setCustomId("newTest")
      .setLabel("Is this test conclusive?")
      .setMinLength(minCharacters)
      .setMaxLength(maxCharacters)
      .setPlaceholder("Type your answer here!")
      .setStyle(TextInputStyle.Short);

    modal.addComponents(
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        newNameInput,
      ),
    );

    return interaction.showModal(modal);
  },
};
