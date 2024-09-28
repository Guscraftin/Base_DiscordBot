import CustomButtonInteraction from "interfaces/button";
import { client } from "../bot";
import fs from "fs/promises";
import path from "path";
import process from "node:process";

function isValidButton(
  button: CustomButtonInteraction,
): button is CustomButtonInteraction {
  return (
    typeof button?.data?.name === "string" &&
    typeof button?.execute === "function"
  );
}

async function loadButton(filePath: string): Promise<void> {
  const { default: button } = await import(filePath);

  if (isValidButton(button)) {
    client.buttons.set(button.data.name, button);
  } else {
    throw new Error(
      `[WARNING] The button at ${filePath} is missing a required "data" or "execute" property.`,
    );
  }
}

async function loadButtonsFromDirectory(directoryPath: string): Promise<void> {
  const files = await fs.readdir(directoryPath, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(directoryPath, file.name);
    if (file.isDirectory()) {
      await loadButtonsFromDirectory(filePath);
    } else if (file.name.endsWith(".ts") || file.name.endsWith(".js")) {
      await loadButton(filePath);
    }
  }
}

export default async function handleButtons(): Promise<void> {
  const foldersPath = path.join(process.cwd(), "src/buttons");
  await loadButtonsFromDirectory(foldersPath)
    .then(() => console.log(`Buttons loaded successfully.`))
    .catch((error) => console.error("Failed to load buttons: ", error));
}
