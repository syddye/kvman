import * as readline from 'readline';

export function setup() {
    /* Stdin stream starts emitting keypress events */
    readline.emitKeypressEvents(process.stdin);
    /* Keystrokes are sent immediately (no need to press 'Enter') */
    process.stdin.setRawMode(true);
}

/** 
 * @param {number} selected 
 * @param {string[]} choices
 * @returns {void}
 */
export function render(selected, choices) {
    clear();
    console.log('Use ↑ ↓ to navigate and press Enter to select:\n');
    for (let i = 0; i < choices.length; i++) {
        if (i === selected) {
            /* Highlight selected option */
            console.log(`> \x1b[36m${i + 1}. ${choices[i]}\x1b[0m`);
            continue;
        }
        console.log(`  ${i + 1}. ${choices[i]}`);
    }
};

export function clear() {
    /* Clear screen */
    console.clear();
    /* Hide cursor */
    process.stdout.write('\x1b[?25l');
}

export function exit() {
    clear();
    process.stdout.write('\x1b[?25h');
    process.exit();
}
