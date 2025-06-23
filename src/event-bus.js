import { EventEmitter } from 'node:events';
import { emitKeypressEvents } from 'node:readline';

import { EventPrefix } from 'src/constants';

/**
 * @typedef {import('src/key-handler-locker').KeyHandlerLocker} KeyHandlerLocker
 */

/**
 * @typedef {Object} Item
 * @property {string} key - new key
 * @property {string} value - new value
 * @property {boolean} isObject - whether the new value is object
 */

/** @class */
export class EventBus extends EventEmitter {
    /** @param {KeyHandlerLocker} locker */
    constructor(locker) {
        super();

        this.locker = locker;
        /* Stdin stream starts emitting keypress events */
        emitKeypressEvents(process.stdin);
        this._sendKeyStrokesImmediately(true);
    }

    listen() {
        process.stdin.on('keypress', async (_, key) => {
            /* Program exit  */
            if (key.ctrl && key.name === 'c') {
                this.emit(`${EventPrefix.EVENT_BUS}:exitCommand`);
                return;
            }
            if (this.locker.isLocked()) return;

            /* Navigation */
            if (key.name === 'up') {
                this.emit(`${EventPrefix.EVENT_BUS}:moveUpCommand`);
                return;
            }
            if (key.name === 'down') {
                this.emit(`${EventPrefix.EVENT_BUS}:moveDownCommand`);
                return;
            }
            if (key.name === 'return') {
                this.emit(`${EventPrefix.EVENT_BUS}:goIntoCommand`);
                return;
            }
            if (key.name === 'backspace') {
                this.emit(`${EventPrefix.EVENT_BUS}:goBackCommand`);
                return;
            }

            if (key.name === 'a') {
                this.emit(`${EventPrefix.EVENT_BUS}:appendItemCommand`);
                return;
            }
        });

        this.on(`${EventPrefix.MENU}:exitCommand`, () => {
            this._sendKeyStrokesImmediately(false);
            process.exit();
        });

        this.on(`${EventPrefix.MENU}:itemCreatedEvent`, (item) => {
            process.stdin.resume();
            this._sendKeyStrokesImmediately(true);
            this.emit(`${EventPrefix.EVENT_BUS}:itemCreatedEvent`, item);
        })
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
