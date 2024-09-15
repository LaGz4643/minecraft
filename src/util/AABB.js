class AABB {
    static EPSILON = 0.0000001;
    
    #pos;
    #size;
    
    constructor(pos, size) {
        this.#pos = pos;
        this.#size = size;
    }

    setPosBottomCenter(pos) {
        this.setPos(pos.addVec(this.#size.multiply(-0.5).setY(0)));
        return this;
    }

    setPos(pos) {
        this.#pos = pos;
    }

    pos(mapFunction) {
        return new AABB(mapFunction(this.#pos), this.#size);
    }

    setSize(size) {
        this.#size = size;
    }

    getBounds() {
        return this.#pos.toArray().concat(this.#pos.addVec(this.#size).toArray());
    }

    expand(vec3) {
        let min = vec3.min(0);
        let max = vec3.max(0);
        return new AABB(this.#pos.addVec(min), this.#size.addVec(max).addVec(min.multiply(-1)));
    }

    inflate(amount) {
        return new AABB(this.#pos.add(-amount, -amount, -amount), this.#size.add(amount * 2, amount * 2, amount * 2));
    }

    toString() {
        return this.#pos + " " + this.#size;
    }
}