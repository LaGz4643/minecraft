class Vec2 {
    static ZERO = Vec2.of();
    
    _x;
    _y;
    
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    static of(x = 0, y = 0) {
        return new Vec2(x, y);
    }

    static ofArray(array) {
        return Vec2.of(array[0], array[1]);
    }

    getX() {
        return this._x;
    }

    getY() {
        return this._y;
    }

    addVec(vec2) {
        return Vec2.of(this._x + vec2.getX(), this._y + vec2.getY());
    }

    add(x, y) {
        return Vec2.of(this._x + x, this._y + y);
    }

    addX(v) {
        return this.add(v, 0);
    }

    addY(v) {
        return this.add(0, v);
    }

    setX(v) {
        return Vec2.of(v, this._y);
    }

    setY(v) {
        return Vec2.of(this._x, v);
    }

    multiplyVec(vec2) {
        return Vec2.of(this._x * vec2.x, this._y * vec2.y);
    }

    multiply(v) {
        return Vec2.of(this._x * v, this._y * v);
    }

    toString() {
        return `${this._x}, ${this._y}`;
    }

    static fromString(string) {
        let coordinates = string.split(",");
        return new BlockPos(parseInt(coordinates[0]), parseInt(coordinates[1]));
    }
}