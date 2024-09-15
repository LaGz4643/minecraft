class Camera {
    #pos;
    #yaw;
    #pitch;
    #screen;
    #fov = 70;
    
    constructor(screen) {
        this.#pos = Vec3.ZERO;
        this.#yaw = 0;
        this.#pitch = 0;
        this.#screen = screen;
    }

    getPos() {
        return this.#pos;
    }

    setPos(pos) {
        this.#pos = pos;
    }

    getYaw() {
        return this.#yaw;
    }

    getPitch() {
        return this.#pitch;
    }

    turn(yaw, pitch) {
        this.#yaw += yaw;
        this.#pitch += pitch;
        this.#pitch = Mth.clamp(this.#pitch, -90, 90);
    }

    getX() {
        return this.#pos.x - this.#screen.width / 64;
    }

    getY() {
        return this.#pos.y - this.#screen.height / 64;
    }

    smoothFov(fov) {
        this.#fov += (fov - this.#fov) / 7;
    }

    getFov() {
        return this.#fov;
    }
}