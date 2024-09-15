class Options {
    #mouseHandler;
    #keyboardHandler;
    #keyBindings = [];

    #fov = 70;
    
    constructor(mouseHandler, keyboardHandler) {
        this.#mouseHandler = mouseHandler;
        this.#keyboardHandler = keyboardHandler;
        this.#mouseHandler.addMouseEventListener(this.onKeyEvent.bind(this));
        this.#keyboardHandler.addKeyEventListener(this.onKeyEvent.bind(this));
    }

    registerKeyBinding(id) {
        let keyBinding = new Options.KeyBinding(id);
        this.#keyBindings.push(keyBinding);
        return keyBinding;
    }
    
    KEY_ATTACK = this.registerKeyBinding("leftMouse");
    KEY_USE = this.registerKeyBinding("rightMouse");

    KEY_FORWARD = this.registerKeyBinding("w");
    KEY_BACKWARD = this.registerKeyBinding("s");
    KEY_LEFT = this.registerKeyBinding("a");
    KEY_RIGHT = this.registerKeyBinding("d");
    KEY_JUMP = this.registerKeyBinding("space");
    KEY_SNEAK = this.registerKeyBinding("shift");
    KEY_SPRINT = this.registerKeyBinding("r");
    KEY_INVENTORY = this.registerKeyBinding("e");
    KEY_DEBUG = this.registerKeyBinding("f3");
    
    KEY_HOTBAR_1 = this.registerKeyBinding("1");
    KEY_HOTBAR_2 = this.registerKeyBinding("2");
    KEY_HOTBAR_3 = this.registerKeyBinding("3");
    KEY_HOTBAR_4 = this.registerKeyBinding("4");
    KEY_HOTBAR_5 = this.registerKeyBinding("5");
    KEY_HOTBAR_6 = this.registerKeyBinding("6");
    KEY_HOTBAR_7 = this.registerKeyBinding("7");
    KEY_HOTBAR_8 = this.registerKeyBinding("8");
    KEY_HOTBAR_9 = this.registerKeyBinding("9");
    
    onKeyEvent(key, down) {
        for (let keyBinding of this.#keyBindings) {
            if (keyBinding.getId() == key) {
                keyBinding.setDown(down);
            }
        }
    }

    getFov() {
        return this.#fov;
    }

    setFov(fov) {
        this.#fov = fov;
    }

    static KeyBinding = class  {
        #id;
        #down = false;
        presses = 0;
    
        constructor(id) {
            this.#id = id;
        }
    
        getId() {
            return this.#id;
        }
    
        isDown() {
            return this.#down;
        }
    
        setDown(down) {
            this.#down = down;
            if (down) {
                this.presses++;
            }
        }
    
        consumePress() {
            if (this.presses > 0) {
                this.presses--;
                return true;
            } else {
                return false;
            }
        }
    }
}