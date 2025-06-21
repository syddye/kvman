/**
 * Enables/disables immediate keypress handling without waiting for 'Enter'
 * @param {boolean} yesNo
 * @returns {void}
 */
export const sendKeyStrokesImmediately = (yesNo) => {
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(yesNo);
    }
}
