/**
 * @typedef {import('src/event-bus').EventBus} EventBus
 */

import { EventPrefix } from 'src/constants';

/**
 * @typedef {Object} Item
 * @property {string} name - Item's name
 * @property {boolean} isSelected - Whether the item is selected
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

        this._eventBus.on(`${EventPrefix.STORAGE}:renderCommand`, (items) => {
            this.render(items);
        });
        this._eventBus.on('select', () => {
            this._eventBus.emit('itemSelected', this.select());
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

    /**
     * @param {Item[]} items 
     * @returns {void} 
     */
    render(items) {
        console.clear();
        this._showCursor(false);
        console.log('Use ↑ ↓ to navigate and press Enter to select:\n');
        for (let i = 0; i < items.length; i++) {
            const { name, isSelected } = items[i];
            if (isSelected) {
                /* Highlight selected option */
                console.log(`> \x1b[36m${i + 1}. ${name}\x1b[0m`);
                continue;
            }
            console.log(`  ${i + 1}. ${name}`);
        }
        
    };

    /**
     * Hides/shows cursor
     * @private
     * @param {boolean} yesNo
     * @returns {void}
     */
    _showCursor(yesNo) {
        const cursor = yesNo ? '\x1b[?25h' : '\x1b[?25l'
        console.log(cursor);
    }
}