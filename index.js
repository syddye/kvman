const readline = require('readline');

const options = require('./options.json')

let selected = 0;
let choices = Object.keys(options);

function setup() {
    /* Stdin stream starts emitting keypress events */
    readline.emitKeypressEvents(process.stdin);
    /* Keystrokes are sent immediately (no need to press 'Enter') */
    process.stdin.setRawMode(true);

}

function render() {
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

function clear() {
    /* Clear screen */
    console.clear();
    /* Hide cursor */
    process.stdout.write('\x1b[?25l');
}

function exit() {
    console.clear();
    process.exit();
}

process.stdin.on('keypress', (_, key) => {
    if (key.name === 'up') {
        selected = (selected - 1 + choices.length) % choices.length;
        render();
    } else if (key.name === 'down') {
        selected = (selected + 1) % choices.length;
        render();
    }


    if (key.name === 'return') {
        console.log(`You selected: ${choices[selected]}`);
        console.clear();
        process.exit();
    }

    if (key.ctrl && key.name === 'c') {
        exit();
    }
});

setup();
render();
