class Axis extends Enum {
    static XP = new Axis(Direction.UP, Direction.SOUTH, Direction.DOWN, Direction.NORTH);
    static YP = new Axis(Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST);
    static ZP = new Axis(Direction.UP, Direction.WEST, Direction.DOWN, Direction.EAST);
    static XN = new Axis(Direction.UP, Direction.NORTH, Direction.DOWN, Direction.SOUTH);
    static YN = new Axis(Direction.NORTH, Direction.WEST, Direction.SOUTH, Direction.EAST);
    static ZN = new Axis(Direction.UP, Direction.EAST, Direction.DOWN, Direction.WEST);

    #directions;
    
    constructor(...directions) {
        super();
        this.#directions = directions;
    }

    getClockwise(direction) {
        return this.#directions[(this.#directions.indexOf(direction) + 1) % 4];
    }

    getCounterClockwise(direction) {
        return this.#directions.at(this.#directions.indexOf(direction) - 1);
    }

    getDirections() {
        return this.#directions;
    }
}