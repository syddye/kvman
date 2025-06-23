/** @class */
export class KeyHandlerLocker {
    /**
     * @private
     * @type {boolean}
     */
    _isLocked = false;

    /** @returns {void} */
    lock() {
        this._isLocked = true;
    }

    /** @returns {void} */
    unlock() {
        this._isLocked = false;
    }

    /** @returns {boolean} */
    isLocked() {
        return this._isLocked;
    }
}