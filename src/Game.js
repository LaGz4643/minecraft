class Game {
    static instance;
    #screen;
    #levelRenderer;
    #mouseHandler;
    #keyboardHandler;
    #options;
    #camera;
    #player;
    #inventoryOpen = false;
    #lastTickStartTime;
    #level;
    #useDownTicks = 0;
    #destroyDownTicks = 0;
    #targetedBlockPos = null;
    #targetedBlockPos2 = null;
    #selectedBlock = Blocks.DIRT;
    
    constructor(params) {
        Game.instance = this;
        this.#screen = new Screen("canvas");
        this.#mouseHandler = new MouseHandler(this.#screen);
        this.#keyboardHandler = new KeyboardHandler(this.#screen);
        this.#options = new Options(this.#mouseHandler, this.#keyboardHandler);
        this.#camera = new Camera(this.#screen);
        this.#mouseHandler.lockCursor();
        this.#level = new Level();
        // this.#level.setBlockLightLevel(BlockPos.of(4, 16, 4), 15);
        this.#player = new Entity(this.#level);
        this.#player.setPos(Vec3.of(1, 18, 2));
        this.#levelRenderer = new LevelRenderer(this.#level);
    }

    async init() {
        await this.reloadResources();
        this.run();
    }

    reloadResources() {
        console.log("Reloading Resources");
        return new Promise(async (resolve) => {
            await this.#levelRenderer.init();
            resolve();
        });
    }

    run() {
        console.log("Running");
        setInterval(() => {
            this.tick();
        }, 50);
        requestAnimationFrame(() => this.renderFrame());
    }

    renderFrame() {
        let partialTick = Math.min((Date.now() - this.#lastTickStartTime) / 50, 1);
        this.render(partialTick);
    }

    render(partialTick) {
        this.#mouseHandler.update();
        while (this.#options.KEY_INVENTORY.consumePress()) {
            this.#inventoryOpen = !this.#inventoryOpen;
            if (this.#inventoryOpen) {
                this.#mouseHandler.lockCursor();
            } else {
                this.#mouseHandler.releaseCursor();
            }
        }
        if (this.#mouseHandler.isPointerLocked()) {
            this.#camera.turn(-this.#mouseHandler.getMouseMoveX() / 1, this.#mouseHandler.getMouseMoveY() / 1);
        }
        this.#camera.smoothFov(this.#options.getFov());
        this.#player.smoothEyeHeight(this.#player.isSneaking() ? 1.2 : 1.62);
        this.#camera.setPos(this.#player.getInterpolatedPos(partialTick).addY(this.#player.getEyeHeight()));
        
        let t = this.#camera.getPos();
        let cameraPitch = this.#camera.getPitch() * (Math.PI / 180);
        let cameraYaw = this.#camera.getYaw() * (Math.PI / 180);
        let lookVec = Vec3.of(-Math.sin(cameraYaw) * Math.cos(cameraPitch), -Math.sin(cameraPitch), -Math.cos(cameraYaw) * Math.cos(cameraPitch));
        lookVec = lookVec.multiply(1 / 16);
        this.#targetedBlockPos = null;
        this.#targetedBlockPos2 = null;
        for (let i = 0; i < 5 * 16; i++) {
            t = t.addVec(lookVec);
            let blockpos1 = BlockPos.of(t.getX(), t.getY(), t.getZ());
            let block = this.#level.getBlock(blockpos1);
            if (!block.isAir()) {
                this.#targetedBlockPos = blockpos1;
                t = t.addVec(lookVec.multiply(-1));
                this.#targetedBlockPos2 = BlockPos.of(t.getX(), t.getY(), t.getZ());
                break;
            }
        }
        
        this.#levelRenderer.render(this.#camera, this.#options.getFov());
        requestAnimationFrame(() => this.renderFrame());
    }

    tick() {
        // while (this.#options.KEY_DEBUG.consumePress()) {
            this.#lastTickStartTime = Date.now();
            
        
        this.#player.baseTick();
        if (this.#mouseHandler.isPointerLocked()) {
            let movementSpeed = 0.1;
            let forward = this.#options.KEY_FORWARD.isDown();
            let backward = this.#options.KEY_BACKWARD.isDown();
            let left = this.#options.KEY_LEFT.isDown();
            let right = this.#options.KEY_RIGHT.isDown();
            let jump = this.#options.KEY_JUMP.isDown();
            let sneak = this.#options.KEY_SNEAK.isDown();
    
            let moveX = 0;
            let moveY = 0;
            let moveZ = 0;
    
            let cameraYaw = this.#camera.getYaw();
            
            let friction = this.#player.isOnGround() ? this.#level.getBlock(BlockPos.ofVec(this.#player.getPos()).below()).getFriction() : 1;

            if (forward && !backward) {
                while (this.#options.KEY_SPRINT.consumePress()) {
                    this.#player.setSprinting(true);
                    this.#options.setFov(90);
                }
            } else {
                this.#player.setSprinting(false);
                this.#options.setFov(70);
            }

            if (this.#player.isSprinting()) {
                movementSpeed *= 1.3;
            }
            if (this.#player.isSneaking()) {
                movementSpeed *= 0.3;
            }
    
            if (forward ^ backward) {
                moveX += Math.sin(cameraYaw * Math.PI / 180) * movementSpeed * (forward ? -1 : 1) * (true ? (0.6 / friction) ** 3 : 0.02);
                moveZ += Math.cos(cameraYaw * Math.PI / 180) * movementSpeed * (forward ? -1 : 1) * (true ? (0.6 / friction) ** 3 : 0.02);
            }
    
            if (right ^ left) {
                moveX += Math.cos((-cameraYaw) * Math.PI / 180) * movementSpeed * (right ? 1 : -1) * (true ? (0.6 / friction) ** 3 : 0.02);
                moveZ += Math.sin((-cameraYaw) * Math.PI / 180) * movementSpeed * (right ? 1 : -1) * (true ? (0.6 / friction) ** 3 : 0.02);
            }
    
            if (jump ^ sneak) {
                moveY += movementSpeed * (jump ? 0 : -1) * 3;
            }
            
            this.#player.addMotion(Vec3.of(moveX, 0, moveZ));
            // console.log(Vec3.of(moveX, 0, moveZ));
            // this.#player.move(Vec3.of(0, moveY, 0));
            // console.log(this.#player.getPos());

            if (this.#options.KEY_JUMP.isDown() && this.#player.isOnGround()) {
                this.#player.setMotion(this.#player.getMotion().setY(0.42));
                if (this.#player.isSprinting()) {
                    let cameraPitch = this.#camera.getPitch() * (Math.PI / 180);
                    let cameraYaw = this.#camera.getYaw() * (Math.PI / 180);
                    this.#player.addMotion((Vec3.of(0.2, 0, 0.2).multiplyVec(Vec3.of(-Math.sin(cameraYaw), 1, -Math.cos(cameraYaw)))));
                }
            }

            this.#player.setSneaking(this.#options.KEY_SNEAK.isDown());

            while (this.#options.KEY_HOTBAR_1.consumePress()) {
                this.#selectedBlock = Blocks.DIRT;
            }
            while (this.#options.KEY_HOTBAR_2.consumePress()) {
                this.#selectedBlock = Blocks.COBBLESTONE;
            }
            while (this.#options.KEY_HOTBAR_3.consumePress()) {
                this.#selectedBlock = Blocks.OAK_PLANKS;
            }
            while (this.#options.KEY_HOTBAR_4.consumePress()) {
                this.#selectedBlock = Blocks.STONE;
            }
            while (this.#options.KEY_HOTBAR_5.consumePress()) {
                this.#selectedBlock = Blocks.OAK_LOG;
            }
            while (this.#options.KEY_HOTBAR_7.consumePress()) {
                this.#selectedBlock = Blocks.TNT;
            }
            while (this.#options.KEY_HOTBAR_8.consumePress()) {
                this.#selectedBlock = Blocks.PACKED_ICE;
            }
            while (this.#options.KEY_HOTBAR_9.consumePress()) {
                this.#selectedBlock = Blocks.SLIME_BLOCK;
            }
        } else {
            this.#player.setSprinting(false);
            this.#options.setFov(70);
        }
        this.#player.tick();
        if (this.#options.KEY_ATTACK.isDown()) {
            if (this.#destroyDownTicks % 4 == 0) {
                if (this.#targetedBlockPos) {
                    this.#level.setBlock(this.#targetedBlockPos, Blocks.AIR);
                    // this.#level.updateLight(BlockPos.of(4, 20, 4));
                    // this.#level.setBlockLightLevel(BlockPos.of(4, 20, 4), 15);
                    this.#levelRenderer.rebuildChunkMeshes();
                    this.#levelRenderer.test();
                }
            }
            this.#destroyDownTicks++;
        } else {
            this.#destroyDownTicks = 0;
        }
        if (this.#options.KEY_USE.isDown()) {
            if (this.#useDownTicks % 4 == 0) {
                if (this.#targetedBlockPos2) {
                    if (!this.#selectedBlock.getCollisionShape(this.#targetedBlockPos2).intersects(this.#player.getAABB())) {
                        this.#level.setBlock(this.#targetedBlockPos2, this.#selectedBlock);
                        // this.#level.updateLight(BlockPos.of(4, 16, 4));
                        // this.#level.setBlockLightLevel(BlockPos.of(4, 16, 4), 15);
                        this.#levelRenderer.rebuildChunkMeshes();
                        this.#levelRenderer.test();
                    }
                }
            }
            this.#useDownTicks++;
        } else {
            this.#useDownTicks = 0;
        }
    }
}