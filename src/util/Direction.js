class Direction extends Enum {
    static WEST = new Direction(1, 0, 0);
    static UP = new Direction(0, 1, 0);
    static NORTH = new Direction(0, 0, 1);
    static EAST = new Direction(-1, 0, 0);
    static DOWN = new Direction(0, -1, 0);
    static SOUTH = new Direction(0, 0, -1);

    #vector;

    constructor(x, y, z) {
        super();
        this.#vector = Vec3.of(x, y, z);
    }

    getVector() {
        return this.#vector;
    }

    clockwise(axis = Axis.Y) {
        return axis.getClockwise(this);
    }

    counterClockwise(axis = Axis.Y) {
        return axis.getCounterClockwise(this);
    }

    getOpposite() {
        switch (this) {
            case Direction.UP:
                return Direction.DOWN;
            case Direction.DOWN:
                return Direction.UP;
            case Direction.NORTH:
                return Direction.SOUTH;
            case Direction.EAST:
                return Direction.WEST;
            case Direction.SOUTH:
                return Direction.NORTH;
            case Direction.WEST:
                return Direction.EAST;
        }
    }

    getAxis() {
        switch (this) {
            case Direction.UP:
                return Axis.YP;
            case Direction.DOWN:
                return Axis.YN;
            case Direction.NORTH:
                return Axis.ZP;
            case Direction.EAST:
                return Axis.XN;
            case Direction.SOUTH:
                return Axis.ZN;
            case Direction.WEST:
                return Axis.XP;
        }
    }
}