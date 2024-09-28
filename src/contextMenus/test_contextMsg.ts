import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import { CustomClient } from "bot";

export default {
  data: new ContextMenuCommandBuilder()
    .setName("Test msg")
    .setType(ApplicationCommandType.Message)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  deferOptions: { ephemeral: true },
  async execute(
    client: CustomClient,
    interaction: ContextMenuCommandInteraction,
  ) {
    return await interaction.editReply({
      content: "Here's a test message that works!",
    });
  },
};
