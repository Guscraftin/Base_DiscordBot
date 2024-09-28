import CustomStringSelectMenuInteraction from "interfaces/selectMenu";
import { client } from "../bot";
import fs from "fs/promises";
import path from "path";
import process from "node:process";

function isValidSelectMenu(
  selectMenu: CustomStringSelectMenuInteraction,
): selectMenu is CustomStringSelectMenuInteraction {
  return (
    typeof selectMenu?.data?.name === "string" &&
    typeof selectMenu?.execute === "function"
  );
}

async function loadSelectMenu(filePath: string): Promise<void> {
  const { default: selectMenu } = await import(filePath);

  if (isValidSelectMenu(selectMenu)) {
    client.selectMenus.set(selectMenu.data.name, selectMenu);
  } else {
    throw new Error(
      `[WARNING] The selectMenu at ${filePath} is missing a required "data" or "execute" property.`,
    );
  }
}

async function loadSelectMenusFromDirectory(
  directoryPath: string,
): Promise<void> {
  const files = await fs.readdir(directoryPath, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(directoryPath, file.name);
    if (file.isDirectory()) {
      await loadSelectMenusFromDirectory(filePath);
    } else if (file.name.endsWith(".ts") || file.name.endsWith(".js")) {
      await loadSelectMenu(filePath);
    }
  }
}

export default async function handleSelectMenus(): Promise<void> {
  const foldersPath = path.join(process.cwd(), "src/selectMenus");
  await loadSelectMenusFromDirectory(foldersPath)
    .then(() => console.log(`SelectMenus loaded successfully.`))
    .catch((error) => console.error("Failed to load selectMenus: ", error));
}
