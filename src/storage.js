import * as path from 'path';
import * as os from 'node:os';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';

/**
 * @typedef {import('src/menu.js').Item} Item
 */

/** @class */
export class Storage {
    /** @type {string[]} */
    path = [];
    /** @type {Record<string, any>} */
    storage = {};
    storageDir = path.join(os.homedir(), '.kvman');
    storageFile = path.join(this.storageDir, 'storage.json');

    constructor() {
        if (!existsSync(this.storageDir)) {
            mkdirSync(this.storageDir);
            this.save();
        }
        const data = readFileSync(this.storageFile, { encoding: 'utf8' });
        this.storage = data ? JSON.parse(data) : {};
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

    /**
     * 
     * @param {Item} item 
     * @returns {void}
     */
    append({ key, value, isObject }) {
        this.storage[key] = isObject ? {} : value;
        this.save();
        return;
    }

    /**
     * @param {string} key
     * @param {any} value
     */
    set(key, value) {
        this.storage[key] = value;
    }
}
