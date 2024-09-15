class Entity {
    #pos = Vec3.ZERO;
    #lastPos = Vec3.ZERO;
    #motion = Vec3.ZERO;
    #aabb = new AABB(Vec3.ZERO, Vec3.of(0.6, 1.8, 0.6));
    #level;
    #onGround = false;
    #sprinting = false;
    #sneaking = false;
    #eyeHeight = 0;

    constructor(level) {
        this.#level = level;
    }

    baseTick() {
        this.#lastPos = this.#pos;
    }

    tick() {
        // console.log(this.#level.getBlock(BlockPos.ofVec(this.#pos).below()));
        let friction = this.isOnGround() ? this.#level.getBlock(BlockPos.ofVec(this.#pos).below()).getFriction() : 1;
        // console.log(friction);
        // let friction = this.isOnGround() ? 0 : 0.9;
        // this.#motion = this.#motion.multiplyVec(Vec3.of(friction, 0.98, friction));
        this.#motion = this.#motion.multiplyVec(Vec3.of(1, 0.98, 1));
        this.move(this.#motion);
        let drag = friction * 0.91;
        this.#motion = this.#motion.multiplyVec(Vec3.of(drag, 1, drag));
        this.#motion = this.#motion.add(0, -0.08, 0);
    }

    getMotion() {
        return this.#motion;
    }

    addMotion(vec3) {
        this.#motion = this.#motion.addVec(vec3);
    }

    setMotion(vec3) {
        this.#motion = vec3;
    }

    move(vec3) {
        let moveVec = this.collide(vec3);
        if (moveVec.getX() != vec3.getX()) {
            this.#motion = this.#motion.setX(0);
        }
        if (moveVec.getY() != vec3.getY()) {
            if (this.#level.getBlock(BlockPos.ofVec(this.#pos).below()) == Blocks.SLIME_BLOCK && !this.isSneaking()) {
                this.#motion = this.#motion.multiplyVec(Vec3.of(1, -1, 1));
            } else {
                this.#motion = this.#motion.setY(0);
            }
        }
        if (moveVec.getZ() != vec3.getZ()) {
            this.#motion = this.#motion.setZ(0);
        }
        // console.log(vec3);
        this.setPos(this.#pos.addVec(moveVec));
        // console.log(this.#pos.getY());
        
    }

    collide(vec3) {
        // let aabb = this.#aabb.expand(vec3);
        // console.log(this.#aabb.getBounds());
        let aabb = this.#aabb.expand(vec3);
        let aabb1 = aabb.inflate(AABB.EPSILON);
        let bounds = aabb1.getBounds();
        // console.log(bounds);
        let blockpositions = [];
        let mutableblockpos = BlockPos.MutableBlockPos.of();
        for (let y = Math.floor(bounds[1]); y <= Math.floor(bounds[4]); y++) {
            for (let x = Math.floor(bounds[0]); x <= Math.floor(bounds[3]); x++) {
                for (let z = Math.floor(bounds[2]); z <= Math.floor(bounds[5]); z++) {
                    let collisionShape = this.#level.getBlock(mutableblockpos.set(x, y, z)).getCollisionShape(mutableblockpos);
                    if (!(collisionShape == Shape.EMPTY) && collisionShape.intersects(aabb1)) {
                        blockpositions.push(BlockPos.of(x, y, z));
                    }
                }
            }
        }
        // console.log(blockpositions.toString());
        let y = aabb.getBounds()[1];
        let y1 = aabb.getBounds()[4];
        let mX = vec3.getX();
        let mY = vec3.getY();
        let mZ = vec3.getZ();
        this.#onGround = false;
        // console.log(mY);

        let currentAABB = this.#aabb.inflate(-AABB.EPSILON);
        let currentBounds = currentAABB.getBounds();
        let fX = 0;
        let fY = 0;
        let fZ = 0;
        blockpositions.forEach(blockpos => {
            if (blockpos.getX() < currentBounds[3] && blockpos.getX() + 1 > currentBounds[0] && blockpos.getZ() < currentBounds[5] && blockpos.getZ() + 1 > currentBounds[2]) {
                if (mY < 0 && blockpos.getY() + 1 < currentBounds[1]) {
                    fY = Math.max((blockpos.getY() + 1) - y, fY);
                    this.#onGround = true;
                } else if (mY > 0 && blockpos.getY() > currentBounds[4]) {
                    fY = Math.min(blockpos.getY() - y1, fY);
                }
            }
        });
        aabb = aabb.pos(pos => pos.addY(mY + fY));
        let x = aabb.getBounds()[0];
        let x1 = aabb.getBounds()[3];
        currentAABB = currentAABB.pos(pos => pos.addY(mY + fY));
        currentBounds = currentAABB.getBounds();
        blockpositions.forEach(blockpos => {
            if (blockpos.getY() < currentBounds[4] && blockpos.getY() + 1 > currentBounds[1] && blockpos.getZ() < currentBounds[5] && blockpos.getZ() + 1 > currentBounds[2]) {
                if (mX < 0 && blockpos.getX() + 1 < currentBounds[0]) {
                    fX = Math.max((blockpos.getX() + 1) - x, fX);
                } else if (mX > 0 && blockpos.getX() > currentBounds[3]) {
                    fX = Math.min(blockpos.getX() - x1, fX);
                }
            }
        });
        aabb = aabb.pos(pos => pos.addX(mX + fX));
        let z = aabb.getBounds()[2];
        let z1 = aabb.getBounds()[5];
        currentBounds = currentAABB.pos(pos => pos.addX(mX + fX)).getBounds();
        blockpositions.forEach(blockpos => {
            if (blockpos.getX() < currentBounds[3] && blockpos.getX() + 1 > currentBounds[0] && blockpos.getY() < currentBounds[4] && blockpos.getY() + 1 > currentBounds[1]) {
                if (mZ < 0 && blockpos.getZ() + 1 < currentBounds[2]) {
                    fZ = Math.max((blockpos.getZ() + 1) - z, fZ);
                } else if (mZ > 0 && blockpos.getZ() > currentBounds[5]) {
                    fZ = Math.min(blockpos.getZ() - z1, fZ);
                }
            }
        });
        // console.log(mY);
        // console.log(mY + fY);
        // console.log(this.#pos.getY());
        // console.log(this.#pos.getY() + mY + fY);
        return vec3.addVec(Vec3.of(fX, fY, fZ));
    }

    getPos() {
        return this.#pos;
    }

    setPos(pos) {
        this.#pos = pos;
        this.#aabb.setPosBottomCenter(pos);
    }

    getInterpolatedPos(v) {
        return Mth.lerpVec3(v, this.#lastPos, this.#pos);
    }

    getAABB() {
        return this.#aabb;
    }

    isOnGround() {
        return this.#onGround;
    }

    isSprinting() {
        return this.#sprinting;
    }

    setSprinting(sprinting) {
        this.#sprinting = sprinting;
    }

    isSneaking() {
        return this.#sneaking;
    }

    setSneaking(sneaking) {
        this.#sneaking = sneaking;
        if (sneaking) {
            this.#aabb.setSize(Vec3.of(0.6, 1.5, 0.6));
        } else {
            this.#aabb.setSize(Vec3.of(0.6, 1.8, 0.6));
        }
    }

    smoothEyeHeight(eyeHeight) {
        this.#eyeHeight += (eyeHeight - this.#eyeHeight) / 5.5;
    }

    getEyeHeight() {
        return this.#eyeHeight;
    }
}