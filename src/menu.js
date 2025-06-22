import * as readline from 'node:readline/promises';

import { sendKeyStrokesImmediately } from 'src/utils';

/**
 * @typedef {import('src/event-bus').EventBus} EventBus
 */

/**
 * @typedef {Object} Item
 * @property {string} key - new key
 * @property {string} value - new value
 * @property {boolean} isObject - whether the new value is object
 */

/** @class */
export class Menu {
    /** @type {string[]} */
    items = []
    selected = 0;

    /** 
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this._eventBus = eventBus;

        this._eventBus.on('movedUp', () => {
            this.up();
            this.render();
        });
        this._eventBus.on('movedDown', () => {
            this.down();
            this.render();
        });
        this._eventBus.on('itemsUpdated', (items) => {
            this.setItems(items);
            this.render();
        });
    }

    /**
     * @param {string[]} items
     * @returns {void} 
     */
    setItems(items) {
        this.items = items;
        this.selected = 0;
    }

    /** @returns {void} */
    up() {
        if (this.selected === 0) return;
        this.selected--;
    }

    /** @returns {void} */
    down() {
        if (this.selected === this.items.length - 1) return;
        this.selected++;
    }

    /** @returns {string} */
    select() {
        return this.items[this.selected];
    }

    /** @returns {void} */
    render() {
        console.clear();
        console.log('Use ↑ ↓ to navigate and press Enter to select:\n');

        for (let i = 0; i < this.items.length; i++) {
            if (i === this.selected) {
                /* Highlight selected option */
                console.log(`> \x1b[36m${i + 1}. ${this.items[i]}\x1b[0m`);
                continue;
            }
            console.log(`  ${i + 1}. ${this.items[i]}`);
        }
        
    };
}