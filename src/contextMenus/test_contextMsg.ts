import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
  ContextMenuCommandType,
  PermissionFlagsBits,
} from "discord.js";
import { CustomClient } from "bot";

export default {
  data: new ContextMenuCommandBuilder()
    .setName("Test msg")
    .setType(ApplicationCommandType.Message as ContextMenuCommandType)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  deferOptions: { ephemeral: true },
  async execute(
    client: CustomClient,
    interaction: ContextMenuCommandInteraction,
  ) {
    return interaction.editReply({
      content: "Here's a test message that works!",
    });
  },
};
