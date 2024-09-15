class Vec3 {
    static ZERO = Vec3.of();
    
    _x;
    _y;
    _z;
    
    constructor(x, y, z) {
        this._x = x;
        this._y = y;
        this._z = z;
    }

    static of(x = 0, y = 0, z = 0) {
        return new Vec3(x, y, z);
    }

    toArray() {
        return [this._x, this._y, this._z];
    }

    static fromArray(array) {
        return Vec3.of(array[0], array[1], array[2]);
    }

    copy() {
        return Vec3.of(this.getX(), this.getY(), this.getZ());
    }

    max(max) {
        return this.map(c => Math.max(c, max));
    }

    min(min) {
        return this.map(c => Math.min(c, min));
    }

    map(mapFunction) {
        return Vec3.of(mapFunction(this._x), mapFunction(this._y), mapFunction(this._z));
    }

    getX() {
        return this._x;
    }

    getY() {
        return this._y;
    }

    getZ() {
        return this._z;
    }

    addVec(vec3) {
        return this.add(vec3.getX(), vec3.getY(), vec3.getZ());
    }

    add(x, y, z) {
        return Vec3.of(this._x + x, this._y + y, this._z + z);
    }

    addX(v) {
        return this.add(v, 0, 0);
    }

    addY(v) {
        return this.add(0, v, 0);
    }

    addZ(v) {
        return this.add(0, 0, v);
    }

    setX(v) {
        return Vec3.of(v, this._y, this._z);
    }

    setY(v) {
        return Vec3.of(this._x, v, this._z);
    }

    setZ(v) {
        return Vec3.of(this._x, this._y, v);
    }

    multiplyVec(vec3) {
        return Vec3.of(this._x * vec3.getX(), this._y * vec3.getY(), this._z * vec3.getZ());
    }

    multiply(v) {
        return Vec3.of(this._x * v, this._y * v, this._z * v);
    }

    toString() {
        return `${this._x}, ${this._y}, ${this._z}`;
    }
}