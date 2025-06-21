import * as readline from 'readline';

export function setup() {
    /* Stdin stream starts emitting keypress events */
    readline.emitKeypressEvents(process.stdin);
    /* Keystrokes are sent immediately (no need to press 'Enter') */
    process.stdin.setRawMode(true);
}
