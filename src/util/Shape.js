class Shape {
    static EMPTY = new Shape();
    
    #shapes;
    
    constructor(shapes = []) {
        this.#shapes = shapes;
    }

    addShape(p0, p1, p2, p3, p4, p5) {
        if (p0 instanceof Vec3 && p1 instanceof Vec3) {
            return this.#addShapeVec(p0, p1);
        }
        return this.addShape(Vec3.of(p0, p1, p2), Vec3.of(p3, p4, p5));
    }

    #addShapeVec(min, max) {
        this.#shapes.push(new VoxelShape(min, max));
        return this;
    }

    intersects(aabb) {
        return this.#shapes.some(voxelshape => voxelshape.intersects(aabb));
    }

    contains(vec3) {
        return this.#shapes.some(voxelshape => voxelshape.contains(vec3));
    }

    addVec(vec3) {
        if (this == Shape.EMPTY) {
            return this;
        }
        return new Shape(this.#shapes.map(shape => shape.addVec(vec3)));
    }
}