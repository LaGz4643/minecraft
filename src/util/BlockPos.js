class BlockPos extends Vec3 {
    constructor(x, y, z) {
        super(Math.floor(x), Math.floor(y), Math.floor(z));
    }

    static of(x = 0, y = 0, z = 0) {
        return new BlockPos(x, y, z);
    }

    static ofVec(vec3) {
        return BlockPos.of(...vec3.toArray());
    }

    static fromString(string) {
        let coordinates = string.split(",");
        return new BlockPos(parseInt(coordinates[0]), parseInt(coordinates[1]), parseInt(coordinates[2]));
    }

    add(x, y, z) {
        return BlockPos.of(this._x + x, this._y + y, this._z + z);
    }

    north(d = 1) {
        return this.add(0, 0, d);
    }

    south(d = 1) {
        return this.add(0, 0, -d);
    }

    east(d = 1) {
        return this.add(-d, 0, 0);
    }

    west(d = 1) {
        return this.add(d, 0, 0);
    }

    above(d = 1) {
        return this.add(0, d, 0);
    }

    below(d = 1) {
        return this.add(0, -d, 0);
    }

    offset(direction) {
        return this.addVec(direction.getVector());
    }

    static MutableBlockPos = class MutableBlockPos extends BlockPos {
        set(x, y, z) {
            this._x = x;
            this._y = y;
            this._z = z;
            return this;
        }
        
        setX(x) {
            this._x = x;
            return this;
        }
        
        setY(y) {
            this._y = y;
            return this;
        }
        
        setZ(z) {
            this._z = z;
            return this;
        }
    
        static of(x = 0, y = 0, z = 0) {
            return new MutableBlockPos(x, y, z);
        }
    
        add(x, y, z) {
            return this.set(this._x + x, this._y + y, this._z + z);
        }
    }
}