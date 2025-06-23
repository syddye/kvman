import * as path from 'path';
import * as os from 'node:os';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { EventPrefix } from './constants';

/**
 * @typedef {import('src/event-bus').EventBus} EventBus
 */

/**
 * @typedef {Object} Item
 * @property {string} key - Item's key
 * @property {string} value - Item's value
 * @property {boolean} isObject - Whether the value is object
 */

/** @class */
export class Storage {
    /** @type {string[]} */
    path = [];
    /** @type {Record<string, any>} */
    storage = {};
    storageDir = path.join(os.homedir(), '.kvman');
    storageFile = path.join(this.storageDir, 'storage.json');

    /** @type {string} */
    selected = ''

    /** 
     * @private
     * @type {Record<string, any> | string}
     */
    _current = {};

    /** 
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this._eventBus = eventBus;
        
        // Load storage
        this.initialize();
        this.storage = this.load();
        this._current = this.storage;

        /* Navigation */
        this._eventBus.on(`${EventPrefix.EVENT_BUS}:moveUpCommand`, () => this.moveUp());
        this._eventBus.on(`${EventPrefix.EVENT_BUS}:moveDownCommand`, () => this.moveDown());
        this._eventBus.on(`${EventPrefix.EVENT_BUS}:goIntoCommand`, () => this.goInto());
        this._eventBus.on(`${EventPrefix.EVENT_BUS}:goBackCommand`, () => this.goBack());

        this._eventBus.on(`${EventPrefix.EVENT_BUS}:appendItemCommand`, () => this.append());
        this._eventBus.on(`${EventPrefix.EVENT_BUS}:itemCreatedEvent`, (item) => this.create(item));

        this._eventBus.on(`${EventPrefix.EVENT_BUS}:exitCommand`, () => {
            this.save();
            this._eventBus.emit(`${EventPrefix.STORAGE}:exitCommand`);
        });
    }

    run() {
        const items = [];
        const keys = Object.keys(this.storage);
        for (let i = 0; i < keys.length; i++) {
            items.push({ name: keys[i], isSelected: i === 0 });
        }
        this.selected = keys[0];
        this._eventBus.emit(`${EventPrefix.STORAGE}:renderCommand`, items);
    }

    initialize() {
        if (!existsSync(this.storageDir)) {
            mkdirSync(this.storageDir);
            this.save();
        }
    }

    save() {
        writeFileSync(this.storageFile, JSON.stringify(this.storage, null, 4), { encoding: 'utf8' });
    }

    load() {
        const data = readFileSync(this.storageFile, { encoding: 'utf8' });
        return data ? JSON.parse(data) : {};
    }

    moveUp() {
        if (typeof this._current === 'string') return;
        const keys = Object.keys(this._current);
        const selectedIndex = keys.indexOf(this.selected);
        if (selectedIndex <= 0) return;

        const items = [];
        for (let i = 0; i < keys.length; i++) {
            items.push({ name: keys[i], isSelected: i === selectedIndex - 1 });
        }
        this.selected = keys[selectedIndex - 1];
        this._eventBus.emit(`${EventPrefix.STORAGE}:renderCommand`, items);
    }

    moveDown() {
        if (typeof this._current === 'string') return;
        const keys = Object.keys(this._current);
        const selectedIndex = keys.indexOf(this.selected);
        if (selectedIndex === keys.length - 1) return;

        const items = [];
        for (let i = 0; i < keys.length; i++) {
            items.push({ name: keys[i], isSelected: i === selectedIndex + 1 });
        }
        this.selected = keys[selectedIndex + 1];
        this._eventBus.emit(`${EventPrefix.STORAGE}:renderCommand`, items);
    }

    goInto() {
        if (typeof this._current === 'string') return;
        this._current = this._current[this.selected];
        const keys = typeof this._current === 'string' ? [this._current] : Object.keys(this._current);

        const items = [];
        for (let i = 0; i < keys.length; i++) {
            items.push({ name: keys[i], isSelected: i === 0 });
        }

        this.path.push(this.selected);
        this.selected = keys[0];
        this._eventBus.emit(`${EventPrefix.STORAGE}:renderCommand`, items);
    }

    goBack() {
        const previous = this.path.pop();
        if (!previous) return;

        this.selected = previous;
        this._current = this.storage;
        for (const key of this.path) {
            // @ts-ignore
            this._current = this._current[key]
        }

        const items = [];
        const keys = Object.keys(this._current);
        for (let i = 0; i < keys.length; i++) {
            items.push({ name: keys[i], isSelected: i === keys.indexOf(this.selected) });
        }
        this._eventBus.emit(`${EventPrefix.STORAGE}:renderCommand`, items);
    }

    /**  
     * @returns {string[]}
     */
    list() {
        // @ts-ignore
        return this._isValue() ? [this._current] : Object.keys(this._current);
    }

    /** @param {Item} item */
    create({ key, value, isObject }) {
        // @ts-ignore
        this._current[key] = isObject ? {} : value;
        this.save();

        const keys = Object.keys(this._current);
        const selectedIndex = keys.indexOf(key);

        const items = [];
        for (let i = 0; i < keys.length; i++) {
            items.push({ name: keys[i], isSelected: i === selectedIndex });
        }
        this.selected = keys[selectedIndex];

        this._eventBus.emit(`${EventPrefix.STORAGE}:renderCommand`, items);
    }

    append() {
        if (this._isValue()) {
            return;
        };
        this._eventBus.emit(`${EventPrefix.STORAGE}:appendItemCommand`);
    }

    _navigate() {
        this._current = this.storage;
        for (const key of this.path) {
            // @ts-ignore
            this._current = this._current[key]
        }
    }

    _isValue() {
        return typeof this._current === 'string';
    }
}
