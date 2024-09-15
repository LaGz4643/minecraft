class VoxelShape {
    #min;
    #max;
    
    constructor(min, max) {
        this.#min = min;
        this.#max = max;
    }

    intersects(aabb) {
        let bounds = aabb.getBounds();
        return bounds[0] < this.#max.getX() && bounds[1] < this.#max.getY() && bounds[2] < this.#max.getZ() && bounds[3] > this.#min.getX() && bounds[4] > this.#min.getY() && bounds[5] > this.#min.getZ();
    }

    contains(vec3) {
        return vec3.getX() < this.#max.getX() && vec3.getY() < this.#max.getY() && vec3.getZ() < this.#max.getZ() && vec3.getX() > this.#min.getX() && vec3.getY() > this.#min.getY() && vec3.getZ() > this.#min.getZ();
    }

    addVec(vec3) {
        return new VoxelShape(this.#min.addVec(vec3), this.#max.addVec(vec3));
    }
}