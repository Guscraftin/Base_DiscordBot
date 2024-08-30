import { client } from '../bot';
import fs from 'fs/promises';
import path from 'path';
import CustomContextMenuCommandInteraction from 'interfaces/contextMenu';
import { ContextMenuCommandBuilder } from 'discord.js';

async function loadContextMenusFromDirectory(directoryPath: string): Promise<void> {
    const files = await fs.readdir(directoryPath, { withFileTypes: true });

    for (const file of files) {
        const filePath = path.join(directoryPath, file.name);
        if (file.isDirectory()) {
            await loadContextMenusFromDirectory(filePath);
        } else if (file.name.endsWith('.ts') || file.name.endsWith('.js')) {
            await loadContextMenu(filePath);
        }
    }
}

async function loadContextMenu(filePath: string): Promise<void> {
    const { default: contextMenu } = await import(filePath);

    if (isValidContextMenu(contextMenu)) {
        client.contextMenus.set(contextMenu.data.name, contextMenu);
    } else {
        throw new Error(`[WARNING] The contextMenu at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

function isValidContextMenu(contextMenu: CustomContextMenuCommandInteraction): contextMenu is CustomContextMenuCommandInteraction {
    return contextMenu?.data instanceof ContextMenuCommandBuilder && typeof contextMenu?.execute === 'function';
}

export default async function(): Promise<void> {
    const foldersPath = path.join(process.cwd(), 'src/contextMenus');
    await loadContextMenusFromDirectory(foldersPath)
        .then(() => console.log(`ContextMenus loaded successfully.`))
        .catch(error => console.error('Failed to load contextMenus: ', error));
}