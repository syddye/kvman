import { Menu } from './menu.js';
import { setup } from './util.js';
import { Storage } from './storage.js';

const storage = new Storage();
const menu = new Menu(storage.keys());

process.stdin.on('keypress', (_, key) => {
    if (key.name === 'up') {
        menu.up();
        menu.render();
    } else if (key.name === 'down') {
        menu.down();
        menu.render();
    } else if (key.name === 'return') {
        storage.save();
        menu.clear();
        console.log(`You selected: ${menu.select()}`);
        process.exit();
    } else if (key.ctrl && key.name === 'c') {
        storage.save();
        menu.clear();
        process.exit();
    }
});

setup();
menu.render();
