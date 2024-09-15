class AirBlock extends Block {
    constructor(friction) {
        super(friction);
        this._collisionShape = Shape.EMPTY;
    }
    
    isAir() {
        return true;
    }
}