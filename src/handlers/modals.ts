import { client } from '../bot';
import fs from 'fs/promises';
import path from 'path';
import CustomModalInteraction from 'interfaces/modal';

async function loadModalsFromDirectory(directoryPath: string): Promise<void> {
    const files = await fs.readdir(directoryPath, { withFileTypes: true });

    for (const file of files) {
        const filePath = path.join(directoryPath, file.name);
        if (file.isDirectory()) {
            await loadModalsFromDirectory(filePath);
        } else if (file.name.endsWith('.ts') || file.name.endsWith('.js')) {
            await loadModal(filePath);
        }
    }
}

async function loadModal(filePath: string): Promise<void> {
    const { default: modal } = await import(filePath);

    if (isValidModal(modal)) {
        client.modals.set(modal.data.name, modal);
    } else {
        console.log(`[WARNING] The modal at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

function isValidModal(modal: any): modal is CustomModalInteraction {
    return typeof modal?.data?.name === 'string' && typeof modal?.execute === 'function';
}

export default async function(): Promise<void> {
    const foldersPath = path.join(process.cwd(), 'src/modals');
    await loadModalsFromDirectory(foldersPath)
        .then(() => console.log(`Modals loaded successfully.`))
        .catch(error => console.error('Failed to load modals: ', error));
}