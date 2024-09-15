class Screen {
    #canvas;
    #mouseMoveListeners = [];
    #mouseDownListeners = [];
    #mouseUpListeners = [];
    
    constructor(id) {
        this.#canvas = document.getElementById(id);
        // this.styles = window.getComputedStyle(this.canvas);
        this.#canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
        document.addEventListener("mousedown", this.onMouseDown.bind(this));
        document.addEventListener("mouseup", this.onMouseUp.bind(this));
        this.#canvas.addEventListener("contextmenu", event => event.preventDefault());

        // this.compositeCanvas = new OffscreenCanvas(this.width, this.height);
    }

    // getStyle(property) {
    //     return this.styles.getPropertyValue(property);
    // }

    onMouseMove(event) {
        this.#mouseMoveListeners.forEach(listener => listener(event));
    }

    onMouseDown(event) {
        this.#mouseDownListeners.forEach((listener) => {
            listener(event);
        });
    }

    onMouseUp(event) {
        this.#mouseUpListeners.forEach((listener) => {
            listener(event);
        });
    }

    addMouseMoveListener(listener) {
        this.#mouseMoveListeners.push(listener);
    }

    addMouseDownListener(listener) {
        this.#mouseDownListeners.push(listener);
    }

    addMouseUpListener(listener) {
        this.#mouseUpListeners.push(listener);
    }

    getCanvas() {
        return this.#canvas;
    }
}