class Block {
    static SOLID_SHAPE = new Shape().addShape(0, 0, 0, 1, 1, 1);

    _collisionShape;
    _friction;
    
    constructor(friction = 0.6) {
        this._collisionShape = Block.SOLID_SHAPE;
        this._friction = friction;
    }

    isAir() {
        return false;
    }

    getCollisionShape(blockpos) {
        return this._collisionShape.addVec(blockpos);
    }

    getFriction() {
        return this._friction;
    }
}