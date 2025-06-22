import { EventEmitter } from 'node:events';
import { emitKeypressEvents } from 'node:readline';
import * as readline from 'node:readline/promises';

/**
 * @typedef {Object} Item
 * @property {string} key - new key
 * @property {string} value - new value
 * @property {boolean} isObject - whether the new value is object
 */

/** @class */
export class EventBus extends EventEmitter {
    /** 
     * @private
     * @type {boolean}
     */
    _isLocked = false;

    constructor() {
        super();
        /* Stdin stream starts emitting keypress events */
        emitKeypressEvents(process.stdin);
        this._sendKeyStrokesImmediately(true);
        this._showCursor(false);
    }

    initialize() {
        process.stdin.on('keypress', async (_, key) => {
            if (key.ctrl && key.name === 'c') {
                this._sendKeyStrokesImmediately(false);
                this._showCursor(true);
                process.exit();
            }
            if (this._isLocked) return;

            if (key.name === 'up') {
                this.emit('movedUp');
                return;
            }
            if (key.name === 'down') {
                this.emit('movedDown');
                return;
            }
            if (key.name === 'a') {
                this._isLocked = true;

                this._showCursor(true);
                const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
                const key = await rl.question('Key (new_key): ');
                const value = await rl.question('Value ({}): ');
                this.emit('itemCreated', { key, value, isObject: !value });
                rl.close();
                this._showCursor(false);

                process.stdin.resume();
                this._sendKeyStrokesImmediately(true);

                this._isLocked = false;
                return;
            }
            if (key.name === 'return') {
                this.emit('itemSelected');
                return;
            }
        });
    }

    /**
     * Hides/shows cursor
     * @private
     * @param {boolean} yesNo
     * @returns {void}
     */
    _showCursor(yesNo) {
        const cursor = yesNo ? '\x1b[?25h' : '\x1b[?25l'
        process.stdout.write(cursor);
    }

    /**
     * Enables/disables immediate keypress handling without waiting for 'Enter'
     * @private
     * @param {boolean} yesNo
     * @returns {void}
     */
    _sendKeyStrokesImmediately(yesNo) {
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(yesNo);
        }
    }
}
