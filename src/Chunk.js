class Chunk {
    #blocks = new Map();
    #skyLight = new Map();
    #blockLight = new Map();
    
    constructor(params) {
        this.fillWithAir();
    }

    fillWithAir() {
        let blockpos = BlockPos.MutableBlockPos.of();
        for (let y = -64; y < 320; y++) {
            for (let x = 0; x < 16; x++) {
                for (let z = 0; z < 16; z++) {
                    this.#blocks.set(blockpos.set(x, y, z).toString(), Blocks.AIR);
                    this.#skyLight.set(blockpos.toString(), 15);
                    // this.#skyLight.set(blockpos.toString(), 7);
                    this.#blockLight.set(blockpos.toString(), 0);
                }
            }
        }
    }

    getBlock(blockpos) {
        let block = this.#blocks.get(blockpos.toString());
        return block == undefined ? Blocks.VOID_AIR : block;
    }

    setBlock(blockpos, block) {
        this.#blocks.set(blockpos.toString(), block);
        this.setSkyLightLevel(blockpos, block.isAir() ? 15 : 0);
    }

    getBlocks() {
        return this.#blocks;
    }

    getLightLevel(blockpos) {
        return Math.max(this.getSkyLightLevel(blockpos), this.getBlockLightLevel(blockpos));
    }

    getSkyLightLevel(blockpos) {
        // if (this.getBlock(blockpos) == Blocks.COBBLESTONE) {
        //     return 15;
        // }
        let lightLevel = this.#skyLight.get(blockpos.toString());
        return lightLevel != undefined ? lightLevel : 15;
    }

    getBlockLightLevel(blockpos) {
        let lightLevel = this.#blockLight.get(blockpos.toString());
        return lightLevel != undefined ? lightLevel : 15;
    }

    setSkyLightLevel(blockpos, lightLevel) {
        this.#skyLight.set(blockpos.toString(), lightLevel);
    }

    setBlockLightLevel(blockpos, lightLevel) {
        this.#blockLight.set(blockpos.toString(), lightLevel);
    }

    propagateLight(blockpos) {
        let lightLevel = this.getBlockLightLevel(blockpos);
        Direction.values().forEach(direction => {
            let propagateTo = blockpos.offset(direction);
            if ((lightLevel > 1) && (this.getBlock(propagateTo).isAir()) && (this.getBlockLightLevel(propagateTo) < (lightLevel - 1))) {
                // if (lightLevel == 15 && (direction == Direction.DOWN || (direction != Direction.UP && blockpos.getY() == 20))) {
                    // this.setBlockLightLevel(propagateTo, lightLevel);
                // } else {
                    this.setBlockLightLevel(propagateTo, lightLevel - 1);
                // }
                if (lightLevel > 2) {
                    this.propagateLight(propagateTo);
                }
            }
        });
    }

    updateLight(blockpos) {
        let lightLevel = this.getBlockLightLevel(blockpos);
        this.setBlockLightLevel(blockpos, 0);
        Direction.values().forEach(direction => {
            let propagateTo = blockpos.offset(direction);
            if (this.getBlockLightLevel(propagateTo) < lightLevel/* || (lightLevel == 15 && (direction == Direction.DOWN || (direction != Direction.UP && blockpos.getY() == 20)))*/) {
                this.updateLight(propagateTo);
            }
        });
    }
}