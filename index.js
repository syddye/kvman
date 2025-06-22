import { emitKeypressEvents } from 'node:readline';

import { Menu } from 'src/menu.js';
import { Storage } from 'src/storage.js';
import { sendKeyStrokesImmediately } from 'src/utils.js';
import { KeyHandlerLocker } from 'src/key-handler-locker.js';
import { EventBus } from 'src/event-bus';


function setup() {
    const eventBus = new EventBus();
    eventBus.initialize();
    const storage = new Storage(eventBus);
    const menu = new Menu(eventBus);
    menu.setItems(storage.keys());
    menu.render();
}

setup();
