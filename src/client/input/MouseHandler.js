class MouseHandler {
    #mouseEventListeners = [];
    mouseX = 0;
    mouseY = 0;
    #mouseMoveX = 0;
    #mouseMoveY = 0;
    #mouseMoveX2 = 0;
    #mouseMoveY2 = 0;
    #pointerLocked = false;
    // mouseDown = false;
    // rightMouseDown = false;
    // #pointerLockX;
    // #pointerLockY;

    constructor(screen) {
        this.screen = screen;
        this.screen.addMouseMoveListener(this.onMouseMove.bind(this));
        this.screen.addMouseDownListener(this.onMouseDown.bind(this));
        this.screen.addMouseUpListener(this.onMouseUp.bind(this));
    }

    update() {
        if (this.#mouseMoveX2 != null) {
            this.#mouseMoveX = this.#mouseMoveX2;
            this.#mouseMoveX2 = null;
        } else {
            this.#mouseMoveX = 0;
        }
        if (this.#mouseMoveY2 != null) {
            this.#mouseMoveY = this.#mouseMoveY2;
            this.#mouseMoveY2 = null;
        } else {
            this.#mouseMoveY = 0;
        }
    }

    onMouseMove(event) {
        let screen = event.target.getBoundingClientRect();
        // this.mouseX = event.offsetX / ((screen.width) / 1920);
        // this.mouseY = event.offsetY / ((screen.height) / 1080);
        this.mouseX = event.offsetX - screen.width / 2;
        this.mouseY = event.offsetY - screen.width / 2;
        this.#mouseMoveX2 = event.movementX;
        this.#mouseMoveY2 = event.movementY;
    }

    getMouseMoveX() {
        return this.#mouseMoveX;
    }

    getMouseMoveY() {
        return this.#mouseMoveY;
    }

    lockCursor() {
        this.screen.getCanvas().requestPointerLock({unadjustedMovement: true}).catch(e => {});
        this.#pointerLocked = true;
        // this.#pointerLockX = this.mouseX;
        // this.#pointerLockY = this.mouseY;
    }

    releaseCursor() {
        document.exitPointerLock();
        this.mouseMoveX = 0;
        this.mouseMoveY = 0;
        this.#pointerLocked = false;
    }

    isPointerLocked() {
        return document.pointerLockElement === this.screen.getCanvas();
    }

    addMouseEventListener(eventListener) {
        this.#mouseEventListeners.push(eventListener);
    }

    onMouseDown(event) {
        // switch (event.button) {
        //     case 0:
        //         this.mouseDown = true;
        //         break;
        //     case 2:
        //         this.rightMouseDown = true;
        //         break;
        // }
        if (!this.isPointerLocked() && this.#pointerLocked) {
            this.lockCursor();
            return;
        }
        let mouseButton;
        switch (event.button) {
            case 0:
                mouseButton = "leftMouse";
                break;
            case 2:
                mouseButton = "rightMouse";
                break;
        }
        // console.log(mouseButton);
        this.#mouseEventListeners.forEach(eventListener => eventListener(mouseButton, true));
        // console.log(`(${this.mouseX}, ${this.mouseY})`);
        // console.log(`(${this.mouseDown}, ${this.rightMouseDown})`);
    }

    onMouseUp(event) {
        // switch (event.button) {
        //     case 0:
        //         this.mouseDown = false;
        //         break;
        //     case 2:
        //         this.rightMouseDown = false;
        //         break;
        //     case 4:
        //     case 5:
        //         event.preventDefault();
        // }
        let mouseButton;
        switch (event.button) {
            case 0:
                mouseButton = "leftMouse";
                break;
            case 2:
                mouseButton = "rightMouse";
                break;
        }
        // console.log(mouseButton);
        this.#mouseEventListeners.forEach(eventListener => eventListener(mouseButton, false));
        // console.log(`(${this.mouseDown}, ${this.rightMouseDown})`);
    }
}