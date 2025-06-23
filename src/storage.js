import * as path from 'path';
import * as os from 'node:os';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { EventPrefix } from './constants';

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

    /** @type {string} */
    selected = ''

    /** 
     * @private
     * @readonly
     */
    _previous = Symbol('previous');

    /** 
     * @private
     * @type {Record<string, any> | string}
     */
    _current = {};

    /** 
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        // Load storage
        this.initialize();
        this.storage = this.load();
        this._current = this.storage;
        
        this._eventBus = eventBus;
        this._eventBus.on(`${EventPrefix.EVENT_BUS}:moveUpCommand`, () => this.moveUp());
        this._eventBus.on(`${EventPrefix.EVENT_BUS}:moveDownCommand`, () => this.moveDown());
        this._eventBus.on('append', (item) => {
            // Early return if current element is a value
            if (this._isValue()) return;
            
            this.append(item);
            this._eventBus.emit('render', this.list());
        })
        this._eventBus.on('itemSelected', (item) => {
            // Early return if current element is a value
            if (this._isValue()) return;
            
            this.path.push(item);
            this._navigate();
            this._eventBus.emit('render', this.list());
        })
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
        writeFileSync(this.storageFile, JSON.stringify(this.storage), { encoding: 'utf8' });
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

    /**  
     * @returns {string[]}
     */
    list() {
        // @ts-ignore
        return this._isValue() ? [this._current] : Object.keys(this._current);
    }

    /** 
     * @param {Item} item 
     * @returns {void}
     */
    append(item) {
        // @ts-ignore
        this._current[key] = isObject ? {} : value;
        this.save();
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
