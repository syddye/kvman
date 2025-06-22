import * as path from 'path';
import * as os from 'node:os';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';

/**
 * @typedef {import('src/menu.js').Item} Item
 * @typedef {import('src/event-bus').EventBus} EventBus
 */

/** @class */
export class Storage {
    /** @type {string[]} */
    path = [];
    /** @type {Record<string, any>} */
    storage = {};
    storageDir = path.join(os.homedir(), '.kvman');
    storageFile = path.join(this.storageDir, 'storage.json');

    /** 
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        // Load storage
        this.initialize();
        this.storage = this.load();
        
        this._eventBus = eventBus;
        this._eventBus.on('itemCreated', (item) => {
            this.append(item);
            const items = this.keys();
            this._eventBus.emit('itemsUpdated', items);
        })
    }

    initialize() {
        if (!existsSync(this.storageDir)) {
            mkdirSync(this.storageDir);
            this.save();
        }
    }

    save() {
        writeFileSync(this.storageFile, JSON.stringify(this.storage), { encoding: 'utf8' });
    }

    load() {
        const data = readFileSync(this.storageFile, { encoding: 'utf8' });
        return data ? JSON.parse(data) : {};
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
