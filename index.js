import { Menu } from 'src/menu.js';
import { Storage } from 'src/storage.js';
import { EventBus } from 'src/event-bus';
import { KeyHandlerLocker } from 'src/key-handler-locker';

(() => {
    const locker = new KeyHandlerLocker()
    const eventBus = new EventBus(locker);
    const storage = new Storage(eventBus);
    new Menu(eventBus, locker);

    eventBus.listen();
    storage.run();
})();
