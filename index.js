import { Menu } from 'src/menu.js';
import { Storage } from 'src/storage.js';
import { EventBus } from 'src/event-bus';

(() => {
    const eventBus = new EventBus();
    const storage = new Storage(eventBus);
    new Menu(eventBus);

    eventBus.listen();
    storage.run();
})();
