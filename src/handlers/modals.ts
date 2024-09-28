import CustomModalInteraction from "interfaces/modal";
import { client } from "../bot";
import fs from "fs/promises";
import path from "path";
import process from "node:process";

function isValidModal(
  modal: CustomModalInteraction,
): modal is CustomModalInteraction {
  return (
    typeof modal?.data?.name === "string" &&
    typeof modal?.execute === "function"
  );
}

async function loadModal(filePath: string): Promise<void> {
  const { default: modal } = await import(filePath);

  if (isValidModal(modal)) {
    client.modals.set(modal.data.name, modal);
  } else {
    throw new Error(
      `[WARNING] The modal at ${filePath} is missing a required "data" or "execute" property.`,
    );
  }
}

async function loadModalsFromDirectory(directoryPath: string): Promise<void> {
  const files = await fs.readdir(directoryPath, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(directoryPath, file.name);
    if (file.isDirectory()) {
      await loadModalsFromDirectory(filePath);
    } else if (file.name.endsWith(".ts") || file.name.endsWith(".js")) {
      await loadModal(filePath);
    }
  }
}

export default async function handleModals(): Promise<void> {
  const foldersPath = path.join(process.cwd(), "src/modals");
  try {
    await loadModalsFromDirectory(foldersPath);
    console.log(`Modals loaded successfully.`);
  } catch (error) {
    console.error("Failed to load modals: ", error);
  }
}
