/** @class */
export class Menu {
    /** @type {string[]} */
    items = []
    selected = 0;

    /** @param {string[]} items */
    constructor(items) {
        this.items = items;
    }

    /**
     * @param {string[]} items
     * @returns {void} 
     */
    setItems(items) {
        this.items = items;
        this.selected = 0;
    }

    /** @returns {void} */
    up() {
        if (this.selected === 0) return;
        this.selected--;
    }

    /** @returns {void} */
    down() {
        if (this.selected === this.items.length - 1) return;
        this.selected++;
    }

    /** @returns {string} */
    select() {
        return this.items[this.selected];
    }

    /** @returns {void} */
    render() {
        this.clear();

        console.log('Use ↑ ↓ to navigate and press Enter to select:\n');

        for (let i = 0; i < this.items.length; i++) {
            if (i === this.selected) {
                /* Highlight selected option */
                console.log(`> \x1b[36m${i + 1}. ${this.items[i]}\x1b[0m`);
                continue;
            }
            console.log(`  ${i + 1}. ${this.items[i]}`);
        }
        /* Hide cursor */
        process.stdout.write('\x1b[?25l');
    };


    /** @returns {void} */
    clear() {
        /* Clear screen */
        console.clear();
        /* Show cursor */
        process.stdout.write('\x1b[?25h');
    }
}