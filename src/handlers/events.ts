import { ClientEvents } from 'discord.js';
import { CustomClient } from 'bot';
import fs from 'fs/promises';
import path from 'path';

async function loadEvent(client: CustomClient, filePath: string): Promise<void> {
    const { default: event } = await import(filePath);

    if (!event?.name || typeof event?.execute !== 'function') {
        throw new Error(`The event in ${filePath} is missing a name or execute function.`);
    }

    if (event.once) {
        client.once(event.name, (...args: ClientEvents[]) => event.execute(...args));
    } else {
        client.on(event.name, (...args: ClientEvents[]) => event.execute(...args));
    }
}

async function loadEventsFromDirectory(client: CustomClient, directoryPath: string): Promise<void> {
    const files = await fs.readdir(directoryPath, { withFileTypes: true });

    for (const file of files) {
        const filePath = path.join(directoryPath, file.name);
        if (file.isDirectory()) {
            await loadEventsFromDirectory(client, filePath);
        } else if (file.name.endsWith('.ts') || file.name.endsWith('.js')) {
            await loadEvent(client, filePath);
        }
    }
}

export default async function handleEvents(client: CustomClient): Promise<void> {
    const foldersPath = path.join(process.cwd(), 'src/events');
    await loadEventsFromDirectory(client, foldersPath)
        .then(() => console.log(`Events loaded successfully.`))
        .catch(error => console.error('Failed to load events: ', error));
}