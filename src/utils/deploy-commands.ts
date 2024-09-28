import {
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  RESTPostAPIContextMenuApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import { CustomClient } from "bot";
import process from "node:process";

function getCommandsList(client: CustomClient) {
  const commandsList: (
    | RESTPostAPIContextMenuApplicationCommandsJSONBody
    | RESTPostAPIChatInputApplicationCommandsJSONBody
  )[] = [];
  commandsList.push(...client.commands.map((command) => command.data.toJSON()));
  commandsList.push(
    ...client.contextMenus.map((command) => command.data.toJSON()),
  );
  return commandsList;
}

export async function deployCommands(client: CustomClient) {
  const discordToken = process.env.DISCORD_TOKEN;
  if (!discordToken) {
    throw new Error("DISCORD_TOKEN environment variable is not defined.");
  }
  const rest = new REST({ version: "10" }).setToken(discordToken);
  await (async () => {
    try {
      const commandsList = getCommandsList(client);
      console.log(
        `Started refreshing ${commandsList.length} application (/) commands.`,
      );

      // Check if deploy is possible
      const clientId = process.env.DISCORD_CLIENT_ID;
      if (!clientId) {
        throw new Error("CLIENT_ID environment variable is not defined.");
      }
      const guildId = process.env.DISCORD_GUILD_ID;
      if (!guildId) {
        throw new Error("GUILD_ID environment variable is not defined.");
      }

      // Deploy our commands to a specific guild
      const data: unknown[] = (await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commandsList },
      )) as unknown[];

      // Deploy our commands globally

      // const data: unknown[] = await rest.put(
      //     Routes.applicationCommands(clientId),
      //     { body: commandsList },
      // ) as unknown[];

      console.log(
        `Successfully reloaded ${data.length} application (/) commands.`,
      );
    } catch (error) {
      console.error(`Failed to deploy commands: ${error}`);
    }
  })();
}
