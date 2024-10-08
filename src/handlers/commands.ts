import CustomSlashCommandInteraction from "interfaces/command";
import { SlashCommandBuilder } from "discord.js";
import { client } from "../bot";
import fs from "fs/promises";
import path from "path";
import process from "node:process";

function isValidCommand(
  command: CustomSlashCommandInteraction,
): command is CustomSlashCommandInteraction {
  return (
    command?.data instanceof SlashCommandBuilder &&
    typeof command?.execute === "function"
  );
}

async function loadCommand(filePath: string): Promise<void> {
  const { default: command } = await import(filePath);

  if (isValidCommand(command)) {
    client.commands.set(command.data.name, command);
  } else {
    throw new Error(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
    );
  }
}

async function loadCommandsFromDirectory(directoryPath: string): Promise<void> {
  const files = await fs.readdir(directoryPath, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(directoryPath, file.name);
    if (file.isDirectory()) {
      await loadCommandsFromDirectory(filePath);
    } else if (file.name.endsWith(".ts") || file.name.endsWith(".js")) {
      await loadCommand(filePath);
    }
  }
}

export default async function handleCommands(): Promise<void> {
  const foldersPath = path.join(process.cwd(), "src/commands");
  try {
    await loadCommandsFromDirectory(foldersPath);
    console.log(`Commands loaded successfully.`);
  } catch (error) {
    console.error("Failed to load commands: ", error);
  }
}
