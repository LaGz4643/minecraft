class KeyboardHandler {
    static keyIdMap = Util.make(new Map(), map => {
        map.set(" ", "space");
    });
    
    #keyEventListeners = [];

    constructor() {
        document.addEventListener("keydown", this.onKeyDown.bind(this));
        document.addEventListener("keyup", this.onKeyUp.bind(this));
    }

    addKeyEventListener(eventListener) {
        this.#keyEventListeners.push(eventListener);
    }

    onKeyDown(event) {
        let key;
        if (KeyboardHandler.keyIdMap.has(event.key)) {
            key = KeyboardHandler.keyIdMap.get(event.key);
        } else {
            key = event.key.toLowerCase();
        }
        // console.log(event.key);
        switch (key) {
            case "space":
                // Prevent space scrolling
            // case "Tab":
            // case "escape":
            case "f3":
                event.preventDefault();
                break;
        }
        this.#keyEventListeners.forEach(eventListener => eventListener(key, true));
    }

    onKeyUp(event) {
        let key;
        if (KeyboardHandler.keyIdMap.has(event.key)) {
            key = KeyboardHandler.keyIdMap.get(event.key);
        } else {
            key = event.key.toLowerCase();
        }
        this.#keyEventListeners.forEach(eventListener => eventListener(key, false));
    }
}