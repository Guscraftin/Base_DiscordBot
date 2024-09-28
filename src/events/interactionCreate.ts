import {
  ApplicationCommandType,
  BaseInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  Collection,
  ContextMenuCommandInteraction,
  Events,
  InteractionType,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from "discord.js";
import CustomBaseInteraction from "interfaces/baseInteraction";
import CustomButtonInteraction from "interfaces/button";
import CustomContextMenuCommandInteraction from "interfaces/contextMenu";
import CustomModalInteraction from "interfaces/modal";
import CustomSlashCommandInteraction from "interfaces/command";
import CustomStringSelectMenuInteraction from "interfaces/selectMenu";
import { client } from "../bot";

// TODO: Refactor + add cooldowns

function checkPermissions(
  interaction: BaseInteraction,
  botInteraction: CustomBaseInteraction,
): string {
  if (!botInteraction.botPermissions) {
    return "";
  }
  if (!interaction.appPermissions) {
    return "The bot lacks permissions. Please contact an administrator of this server.";
  }

  const missingPermissions = interaction.appPermissions.missing(
    botInteraction.botPermissions,
  );
  if (missingPermissions.length) {
    return `Here are the permissions the bot needs to correctly execute your interaction: \`${missingPermissions.join("`, `")}\``;
  }

  return "";
}

function isContextMenuCommandInteraction(
  interaction: unknown,
): interaction is ContextMenuCommandInteraction {
  return interaction instanceof ContextMenuCommandInteraction;
}

function isSlashCommandInteraction(
  interaction: unknown,
): interaction is ChatInputCommandInteraction {
  return interaction instanceof ChatInputCommandInteraction;
}

async function handleCommandInteraction(
  interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction,
): Promise<void> {
  const command =
    client.commands.get(interaction.commandName) ||
    client.contextMenus.get(interaction.commandName);

  try {
    if (!command) {
      throw new Error(
        `No command matching ${interaction.commandName} was found.`,
      );
    }

    // Check permissions
    const returnPermission = checkPermissions(interaction, command);
    if (returnPermission) {
      await interaction.reply({
        content: returnPermission,
        ephemeral: true,
      });
      return;
    }

    // Check cooldowns
    const cooldowns = client.cooldowns;

    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name) as Collection<
      string,
      number
    >;
    const defaultCooldownDuration = 0;
    const cooldownAmount =
      (command.cooldown ?? defaultCooldownDuration) * 1_000;

    if (timestamps.has(interaction.user.id)) {
      const expirationTime =
        (timestamps.get(interaction.user.id) ?? 0) + cooldownAmount;

      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1_000);
        await interaction.reply({
          content: `Please wait, you are currently on cooldown for the command named \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
          ephemeral: true,
        });
        return;
      }
    }

    // Check defer options
    if (command.deferOptions) {
      await interaction.deferReply(command.deferOptions);
    }

    if (isContextMenuCommandInteraction(interaction)) {
      await (command as CustomContextMenuCommandInteraction).execute(
        client,
        interaction,
      );
    } else if (isSlashCommandInteraction(interaction)) {
      await (command as CustomSlashCommandInteraction).execute(
        client,
        interaction,
      );
    } else {
      throw new Error(`This command interaction is not valid: ${interaction}`);
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.editReply({
        content: "There was an error while executing this command!",
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
}

async function handleContextMenuCommandInteraction(
  interaction: ContextMenuCommandInteraction,
) {
  await handleCommandInteraction(interaction);
}

async function handleSlashCommandInteraction(
  interaction: ChatInputCommandInteraction,
) {
  await handleCommandInteraction(interaction);
}

async function handleButtonInteraction(
  interaction: ButtonInteraction,
): Promise<void> {
  const button = client.buttons.get(interaction.customId);

  try {
    if (!button) {
      throw new Error(`No button matching ${interaction.customId} was found.`);
    }

    const returnPermission = checkPermissions(interaction, button);
    if (returnPermission) {
      await interaction.reply({
        content: returnPermission,
        ephemeral: true,
      });
      return;
    }
    if (button.deferOptions) {
      await interaction.deferReply(button.deferOptions);
    }

    await (button as CustomButtonInteraction).execute(client, interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this button!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this button!",
        ephemeral: true,
      });
    }
  }
}

async function handleModalInteraction(
  interaction: ModalSubmitInteraction,
): Promise<void> {
  const modal = client.modals.get(interaction.customId);

  try {
    if (!modal) {
      throw new Error(`No modal matching ${interaction.customId} was found.`);
    }

    const returnPermission = checkPermissions(interaction, modal);
    if (returnPermission) {
      await interaction.reply({
        content: returnPermission,
        ephemeral: true,
      });
      return;
    }
    if (modal.deferOptions) {
      await interaction.deferReply(modal.deferOptions);
    }

    await (modal as CustomModalInteraction).execute(client, interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this modal!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this modal!",
        ephemeral: true,
      });
    }
  }
}

async function handleSelectMenuInteraction(
  interaction: StringSelectMenuInteraction,
): Promise<void> {
  const selectMenu = client.selectMenus.get(interaction.customId);

  try {
    if (!selectMenu) {
      throw new Error(
        `No selectMenu matching ${interaction.customId} was found.`,
      );
    }

    const returnPermission = checkPermissions(interaction, selectMenu);
    if (returnPermission) {
      await interaction.reply({
        content: returnPermission,
        ephemeral: true,
      });
      return;
    }
    if (selectMenu.deferOptions) {
      await interaction.deferReply(selectMenu.deferOptions);
    }

    await (selectMenu as CustomStringSelectMenuInteraction).execute(
      client,
      interaction,
    );
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this selectMenu!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this selectMenu!",
        ephemeral: true,
      });
    }
  }
}

export default {
  execute: async (interaction: BaseInteraction) => {
    if (interaction.isCommand()) {
      if (interaction.commandType === ApplicationCommandType.ChatInput) {
        await handleSlashCommandInteraction(
          interaction as ChatInputCommandInteraction,
        );
      } else {
        await handleContextMenuCommandInteraction(
          interaction as ContextMenuCommandInteraction,
        );
      }
    } else if (interaction.isButton()) {
      await handleButtonInteraction(interaction);
    } else if (interaction.isModalSubmit()) {
      await handleModalInteraction(interaction);
    } else if (interaction.isStringSelectMenu()) {
      await handleSelectMenuInteraction(interaction);
    } else {
      console.error(
        `This event of type "${InteractionType[interaction.type]}" is not handled in interactionCreate event. InteractionId: ${interaction}`,
      );
    }
  },
  name: Events.InteractionCreate,
};
