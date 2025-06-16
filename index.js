import options from './options.json' with { type: 'json' };
import { setup, render, exit } from './util.js';

let selected = 0;
let choices = Object.keys(options);

process.stdin.on('keypress', (_, key) => {
    if (key.name === 'up') {
        selected = (selected - 1 + choices.length) % choices.length;
        render(selected, choices);
    } else if (key.name === 'down') {
        selected = (selected + 1) % choices.length;
        render(selected, choices);
    }

    if (key.name === 'return') {
        console.log(`You selected: ${choices[selected]}`);
        exit();
    }

    if (key.ctrl && key.name === 'c') {
        exit();
    }
});

setup();
render(selected, choices);
