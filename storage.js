import path from 'path';
import os from 'node:os';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';

export class Storage {
    path = [];
    storage = {};
    storageDir = path.join(os.homedir(), '.kvman');
    storageFile = path.join(this.storageDir, 'storage.json');

    constructor() {
        if (!existsSync(this.storageDir)) {
            mkdirSync(this.storageDir);
            this.save();
        }
        this.storage = JSON.parse(readFileSync(this.storageFile, { encoding: 'utf8' }));
    }

    save() {
        writeFileSync(this.storageFile, JSON.stringify(this.storage), { encoding: 'utf8' });
    }

    keys() {
        let current = this.storage;
        const choices = Object.keys(current);
        for (const key of this.path) {
            current = this.storage[key];
        }
        return choices;
    }
}
