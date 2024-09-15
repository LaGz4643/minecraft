class Canvas {
    #canvas;
    #renderContext;
    #width;
    #height;
    #compositeCanvas;
    #compositeRenderContext;
    
    constructor(canvas) {
        this.#canvas = canvas;
        this.#renderContext = this.#canvas.getContext("2d");
        this.#renderContext.imageSmoothingEnabled = false;
        this.#width = this.#canvas.width;
        this.#height = this.#canvas.height;
        
        this.#compositeCanvas = new OffscreenCanvas(64, 64);
        this.#compositeRenderContext = this.#compositeCanvas.getContext("2d");
        this.#compositeRenderContext.imageSmoothingEnabled = false;
    }

    getWidth() {
        return this.#width;
    }

    getHeight() {
        return this.#height;
    }

    getRenderContext() {
        return this.#renderContext;
    }

    isOutsideCanvas(from, to) {
        return Math.max(from.x, to.x) < 0 || Math.min(from.x, to.x) > this.#width || Math.max(from.y, to.y) < 0 || Math.min(from.y, to.y) > this.#height;
    }
    
    line(points, width, color) {
        // if (this.isOutsideCanvas(from, to)) {
        //     return;
        // }
        this.#renderContext.beginPath();
        this.#renderContext.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            this.#renderContext.lineTo(points[i].x, points[i].y);
        }
        this.#renderContext.lineWidth = width;
        this.#renderContext.strokeStyle = color;
        this.#renderContext.stroke();
    }
    
    rectangle(from, to, color) {
        if (this.isOutsideCanvas(from, to)) {
            return;
        }
        this.#renderContext.fillStyle = color;
        this.#renderContext.fillRect(from.x, from.y, to.x - from.x, to.y - from.y);
    }
    
    renderTexture(location, from, to, uvFrom, uvTo) {
        if (this.isOutsideCanvas(from, to)) {
            // console.log("texture offscreen");
            return;
        }
        let flag = location == null;
        if (to.x - from.x < 0) {
            this.#renderContext.scale(-1, 1);
            this.#renderContext.translate(-2 * (from.x) + (from.x - to.x), 0);
        }
        try {
            this.#renderContext.drawImage(Textures.getTexture(location), flag ? 0 : uvFrom.x, flag ? 0 : uvFrom.y, flag ? 16 : uvTo.x - uvFrom.x, flag ? 16 : uvTo.y - uvFrom.y, from.x, from.y, to.x - from.x, to.y - from.y);
        } catch (error) {
            console.log(`Failed to render texture: Texture at location ${location} could not be loaded.`);
        }
        this.#renderContext.resetTransform();
    }
    
    renderTextureColorMultiplied(location, color, from, to, uvFrom, uvTo) {
        if (this.isOutsideCanvas(from, to)) {
            return;
        }
        let flag = location == null;
        // if (to.x - from.x < 0) {
        //     this.#renderContext.scale(-1, 1);
        //     this.#renderContext.translate(-2 * (from.x) + (from.x - to.x), 0);
        // }
        try {
            this.#renderContext.drawImage(Textures.getTexture(location), flag ? 0 : uvFrom.x, flag ? 0 : uvFrom.y, flag ? 16 : uvTo.x - uvFrom.x, flag ? 16 : uvTo.y - uvFrom.y, from.x, from.y, to.x - from.x, to.y - from.y);
            // this.#compositeRenderContext.clearRect(0, 0, to.x - from.x, to.y - from.y);
            this.#compositeRenderContext.clearRect(0, 0, this.#compositeCanvas.width, this.#compositeCanvas.height);
            this.#compositeRenderContext.drawImage(Textures.getTexture(location), flag ? 0 : uvFrom.x, flag ? 0 : uvFrom.y, flag ? 16 : uvTo.x - uvFrom.x, flag ? 16 : uvTo.y - uvFrom.y, 0, 0, to.x - from.x, from.y - to.y);
            // console.log(from.x - to.x);
            this.#compositeRenderContext.globalCompositeOperation = "source-atop";
            this.#compositeRenderContext.fillStyle = color;
            this.#compositeRenderContext.fillRect(0, 0, to.x - from.x, from.y - to.y);
            this.#compositeRenderContext.globalCompositeOperation = "source-over";
            this.#renderContext.globalCompositeOperation = "multiply";
            this.#renderContext.drawImage(this.#compositeCanvas, from.x, from.y + (to.y - from.y));
            this.#renderContext.globalCompositeOperation = "source-over";
            
            // this.#compositeRenderContext.clearRect(0, 0, this.#compositeCanvas.width, this.#compositeCanvas.height);
        } catch (error) {
            console.log(error + `Failed to render texture: Texture at location ${location} could not be loaded.`);
        }
        // this.#renderContext.resetTransform();
    }
    
    renderTextureRotated(location, from, to, rotation, rotationPoint, uvFrom, uvTo) {
        if (this.isOutsideCanvas(from, to)) {
            return;
        }
        let flag = location == null;
        this.#renderContext.translate(rotationPoint.x, rotationPoint.y);
        this.#renderContext.rotate(rotation);
        this.#renderContext.translate(-rotationPoint.x, -rotationPoint.y);
        try {
            this.#renderContext.drawImage(Textures.getTexture(location), flag ? 0 : uvFrom.x, flag ? 0 : uvFrom.y, flag ? 16 : uvTo.x - uvFrom.x, flag ? 16 : uvTo.y - uvFrom.y, from.x, from.y, to.x - from.x, to.y - from.y);
        } catch (error) {
            console.log(`Failed to render texture: Texture at location ${location} could not be loaded.`);
        }
        this.#renderContext.resetTransform();
    }
    
    clear() {
        this.#renderContext.clearRect(0, 0, this.#width, this.#height);
    }
    
    resetCompositeOperation() {
        this.setCompositeOperation("source-over");
    }
    
    setCompositeOperation(compositeOperation) {
        this.#renderContext.globalCompositeOperation = compositeOperation;
    }

    addEventListener(...parameters) {
        this.#canvas.addEventListener(...parameters);
    }
}