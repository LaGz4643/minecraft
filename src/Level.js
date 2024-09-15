class Level {
    #chunks = new Map();
    
    constructor(params) {
        this.generateChunk(Vec2.of(0, 0));
    }

    getChunks() {
        return this.#chunks;
    }

    generateChunk(pos) {
        let chunk = new Chunk();
        let blockpos = BlockPos.MutableBlockPos.of();
        for (let y = 0; y < 16; y++) {
            for (let x = 0; x < 16; x++) {
                for (let z = 0; z < 16; z++) {
                    chunk.setBlock(blockpos.set(x, y, z), Blocks.DIRT);
                }
            }
        }
        this.#chunks.set(pos.toString(), chunk);
    }

    getBlock(blockpos) {
        let chunk = this.getChunk(blockpos);
        return chunk ? chunk.getBlock(Vec3.of(blockpos.getX() % 16, blockpos.getY(), blockpos.getZ() % 16)) : Blocks.VOID_AIR;
    }

    setBlock(blockpos, block) {
        let chunk = this.getChunk(blockpos);
        if (chunk) {
            chunk.setBlock(Vec3.of(blockpos.getX() % 16, blockpos.getY(), blockpos.getZ() % 16), block);
        }
    }

    getChunk(blockpos) {
        return this.#chunks.get(Vec2.of(Math.floor(blockpos.getX() / 16), Math.floor(blockpos.getZ() / 16)).toString());
    }

    setBlockLightLevel(blockpos, lightLevel) {
        let chunk = this.getChunk(blockpos);
        if (chunk) {
            chunk.setBlockLightLevel(Vec3.of(blockpos.getX() % 16, blockpos.getY(), blockpos.getZ() % 16), lightLevel);
            chunk.propagateLight(blockpos);
        }
    }

    updateLight(blockpos) {
        let chunk = this.getChunk(blockpos);
        if (chunk) {
            chunk.updateLight(blockpos);
        }
    }
}