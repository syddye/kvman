import { emitKeypressEvents } from 'node:readline';

import { Menu } from 'src/menu.js';
import { Storage } from 'src/storage.js';
import { sendKeyStrokesImmediately } from 'src/utils.js';
import { KeyHandlerLocker } from 'src/key-handler-locker.js';

const storage = new Storage();
const menu = new Menu(storage.keys());
const locker = new KeyHandlerLocker();

function setup() {
    /* Stdin stream starts emitting keypress events */
    emitKeypressEvents(process.stdin);
    sendKeyStrokesImmediately(true);

    process.stdin.on('keypress', async (_, key) => {
        if (key.ctrl && key.name === 'c') {
            menu.clear();
            storage.save();
            sendKeyStrokesImmediately(false);

            process.exit();
        }
        if (locker.isLocked()) return;
        
        if (key.name === 'up') {
            menu.up();
            menu.render();
        } else if (key.name === 'down') {
            menu.down();
            menu.render();
        } else if (key.name === 'a') {
            locker.lock();

            const item = await menu.readNewItem();
            storage.append(item);
            menu.setItems(storage.keys());
            menu.render();
            
            locker.unlock();
        } else if (key.name === 'return') {
            menu.render();
            console.log(`You selected: ${menu.select()}`);
        }
    });

    menu.render();
}

setup();
