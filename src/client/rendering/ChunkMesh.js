class ChunkMesh {
    #vertices = [];
    #indices = [];
    #colors = [];
    #texCoords = [];

    static TEXTURE_WIDTH = 7.1111111111111111111111111111111;
    static TEXTURE_HEIGHT = 7.1111111111111111111111111111111;
    static A = 0.0078125;
    
    constructor(params) {
        
    }

    static forChunk(chunk) {
        let chunkmesh = new ChunkMesh();
        chunk.getBlocks().forEach((block, blockpos) => {
            if (block != Blocks.AIR && block != Blocks.SLIME_BLOCK) {
                blockpos = BlockPos.fromString(blockpos);
                let x = blockpos.getX();
                let y = blockpos.getY();
                let z = blockpos.getZ();
                let textures = [-1, -1, -1];
                switch (block) {
                    case Blocks.DIRT:
                        textures = [0, 0, 0];
                        break;
                    case Blocks.COBBLESTONE:
                        textures = [1, 1, 1];
                        break;
                    case Blocks.OAK_PLANKS:
                        textures = [2, 2, 2];
                        break;
                    case Blocks.STONE:
                        textures = [3, 3, 3];
                        break;
                    case Blocks.OAK_LOG:
                        textures = [4, 5, 5];
                        break;
                    case Blocks.PACKED_ICE:
                        textures = [6, 6, 6];
                        break;
                    case Blocks.TNT:
                        textures = [7, 8, 9];
                        break;
                    case Blocks.SLIME_BLOCK:
                        textures = [10, 10, 10];
                        break;
                }
                let eastPos = blockpos.east();
                if (chunk.getBlock(eastPos).isAir() || chunk.getBlock(eastPos) == Blocks.SLIME_BLOCK) {
                    chunkmesh.addEastFace(x, y, z, textures[0], 0, blockpos, chunk);
                }
                let belowPos = blockpos.below();
                if (chunk.getBlock(belowPos).isAir() || chunk.getBlock(belowPos) == Blocks.SLIME_BLOCK) {
                    chunkmesh.addBottomFace(x, y, z, textures[2], 0, blockpos, chunk);
                }
                let southPos = blockpos.south();
                if (chunk.getBlock(southPos).isAir() || chunk.getBlock(southPos) == Blocks.SLIME_BLOCK) {
                    chunkmesh.addSouthFace(x, y, z, textures[0], 0, blockpos, chunk);
                }
                let westPos = blockpos.west();
                if (chunk.getBlock(westPos).isAir() || chunk.getBlock(westPos) == Blocks.SLIME_BLOCK) {
                    chunkmesh.addWestFace(x, y, z, textures[0], 0, blockpos, chunk);
                }
                let abovePos = blockpos.above();
                if (chunk.getBlock(abovePos).isAir() || chunk.getBlock(abovePos) == Blocks.SLIME_BLOCK) {
                    chunkmesh.addTopFace(x, y, z, textures[1], 0, blockpos, chunk);
                }
                let northPos = blockpos.north();
                if (chunk.getBlock(northPos).isAir() || chunk.getBlock(northPos) == Blocks.SLIME_BLOCK) {
                    chunkmesh.addNorthFace(x, y, z, textures[0], 0, blockpos, chunk);
                }
            }
        });
        chunk.getBlocks().forEach((block, blockpos) => {
            if (block == Blocks.SLIME_BLOCK) {
                blockpos = BlockPos.fromString(blockpos);
                let x = blockpos.getX();
                let y = blockpos.getY();
                let z = blockpos.getZ();
                let textures = [-1, -1, -1];
                switch (block) {
                    case Blocks.DIRT:
                        textures = [0, 0, 0];
                        break;
                    case Blocks.COBBLESTONE:
                        textures = [1, 1, 1];
                        break;
                    case Blocks.OAK_PLANKS:
                        textures = [2, 2, 2];
                        break;
                    case Blocks.STONE:
                        textures = [3, 3, 3];
                        break;
                    case Blocks.OAK_LOG:
                        textures = [4, 5, 5];
                        break;
                    case Blocks.PACKED_ICE:
                        textures = [6, 6, 6];
                        break;
                    case Blocks.TNT:
                        textures = [7, 8, 9];
                        break;
                    case Blocks.SLIME_BLOCK:
                        textures = [10, 10, 10];
                        break;
                }
                let eastPos = blockpos.east();
                if (chunk.getBlock(eastPos).isAir() || chunk.getBlock(eastPos) == Blocks.SLIME_BLOCK) {
                    chunkmesh.addEastFace(x, y, z, textures[0], 0, blockpos, chunk);
                }
                let belowPos = blockpos.below();
                if (chunk.getBlock(belowPos).isAir() || chunk.getBlock(belowPos) == Blocks.SLIME_BLOCK) {
                    chunkmesh.addBottomFace(x, y, z, textures[2], 0, blockpos, chunk);
                }
                let southPos = blockpos.south();
                if (chunk.getBlock(southPos).isAir() || chunk.getBlock(southPos) == Blocks.SLIME_BLOCK) {
                    chunkmesh.addSouthFace(x, y, z, textures[0], 0, blockpos, chunk);
                }
                let westPos = blockpos.west();
                if (chunk.getBlock(westPos).isAir() || chunk.getBlock(westPos) == Blocks.SLIME_BLOCK) {
                    chunkmesh.addWestFace(x, y, z, textures[0], 0, blockpos, chunk);
                }
                let abovePos = blockpos.above();
                if (chunk.getBlock(abovePos).isAir() || chunk.getBlock(abovePos) == Blocks.SLIME_BLOCK) {
                    chunkmesh.addTopFace(x, y, z, textures[1], 0, blockpos, chunk);
                }
                let northPos = blockpos.north();
                if (chunk.getBlock(northPos).isAir() || chunk.getBlock(northPos) == Blocks.SLIME_BLOCK) {
                    chunkmesh.addNorthFace(x, y, z, textures[0], 0, blockpos, chunk);
                }
            }
        });
        return chunkmesh;
    }

    addFace(blockpos, direction, texture, chunk) {
        // let offsetPos = blockpos.offset(direction);
        // if (chunk.getBlock(offsetPos).isAir()) {
        //     chunkmesh.addEastFace(x, y, z, , );
            
        //     this.#vertices.push(x, y + 1, z, x + 1, y + 1, z, x, y + 1, z + 1, x + 1, y + 1, z + 1);
            
        //     let offset = this.#indices.length / 1.5;
        //     this.#indices.push(...[0, 2, 1, 1, 2, 3].map(x => x + offset));
            
        //     let color = chunk.getLightLevel(eastPos) / 15 * 1;
        //     this.#colors.push(color, color, color, color, color, color, color, color, color, color, color, color);
            
        //     let w = 1 / ChunkMesh.TEXTURE_WIDTH;
        //     let h = 1 / ChunkMesh.TEXTURE_HEIGHT;
        //     let u = texture % ChunkMesh.TEXTURE_WIDTH;
        //     let v = Math.floor(texture / ChunkMesh.TEXTURE_HEIGHT);
        //     let textureCoords[0] = u * w + 0.001;
        //     let textureCoords[2] = 1 - (v + 1) * h + 0.001;
        //     let textureCoords[1] = (u + 1) * w - 0.001;
        //     let textureCoords[3] = 1 - v * h - 0.001;
        //     this.#texCoords.push(textureCoords[1], textureCoords[2], textureCoords[0], textureCoords[2], textureCoords[1], textureCoords[3], textureCoords[0], textureCoords[3]);
        // }
    }

    addWestFace(x, y, z, texture, lightLevelMultiplier, blockpos, chunk) {
        this.#vertices.push(x + 1, y, z + 1, x + 1, y, z, x + 1, y + 1, z + 1, x + 1, y + 1, z);
        
        let offset = this.#indices.length / 1.5;
        this.#indices.push(...[0, 1, 2, 1, 3, 2].map(x => x + offset));

        let lightLevels = this.getVertexLight(blockpos, Direction.WEST, chunk).map(lightLevel => lightLevel * 0.6);
        this.#colors.push(lightLevels[0], lightLevels[0], lightLevels[0], lightLevels[1], lightLevels[1], lightLevels[1], lightLevels[3], lightLevels[3], lightLevels[3], lightLevels[2], lightLevels[2], lightLevels[2]);

        let textureCoords = this.getTextureCoords(texture);
        this.#texCoords.push(textureCoords[0], textureCoords[2], textureCoords[1], textureCoords[2], textureCoords[0], textureCoords[3], textureCoords[1], textureCoords[3]);
        return this;
    }

    getTextureCoords(textureId) {
        let textureCoords = [];
        let w = 1/7.1111111111111111111111111111111;
        let h = 1/7.1111111111111111111111111111111;
        let u = textureId % 7;
        let v = Math.floor(textureId / 7);
        textureCoords[0] = u * (1/7.1111111111111111111111111111111) + ChunkMesh.A;
        textureCoords[1] = (u + 1) * (1/7.1111111111111111111111111111111) - ChunkMesh.A;
        textureCoords[2] = 1 - (v + 1) * h + ChunkMesh.A;
        textureCoords[3] = 1 - v * h - ChunkMesh.A;
        return textureCoords;
    }

    getVertexLight(blockpos, faceDirection, chunk) {
        // let c = chunk.getBlock(blockpos) == Blocks.COBBLESTONE;
        let c = false;
        if (c && faceDirection == Direction.UP) {
            blockpos = blockpos.offset(faceDirection.getOpposite());
        }
        let lightLevels = [];
        
        let direction = faceDirection.getAxis().getDirections()[2];
        for (let i = 0; i < 4; i++) {
            let lightLevelsInDirection = [c ? blockpos.offset(faceDirection).offset(faceDirection) : blockpos.offset(faceDirection), blockpos.offset(faceDirection).offset(direction), blockpos.offset(faceDirection).offset(direction.clockwise(faceDirection.getAxis())), blockpos.offset(faceDirection).offset(direction).offset(direction.clockwise(faceDirection.getAxis()))].map(blockpos => /*!chunk.getBlock(blockpos).isAir() ? 3 / 15 : */1 - ((15 - chunk.getLightLevel(blockpos)) / (15 / (1 - 0.25))));
            lightLevels[i] = Util.averageArray(lightLevelsInDirection) * 1;
            
            direction = direction.counterClockwise(faceDirection.getAxis());
        }
        return lightLevels;
    }

    addTopFace(x, y, z, texture, lightLevelMultiplier, blockpos, chunk) {
        this.#vertices.push(x, y + 1, z, x + 1, y + 1, z, x, y + 1, z + 1, x + 1, y + 1, z + 1);
        
        let offset = this.#indices.length / 1.5;
        this.#indices.push(...[0, 2, 1, 1, 2, 3].map(x => x + offset));
        
        let lightLevels = this.getVertexLight(blockpos, Direction.UP, chunk);
        
        this.#colors.push(lightLevels[1], lightLevels[1], lightLevels[1], lightLevels[0], lightLevels[0], lightLevels[0], lightLevels[2], lightLevels[2], lightLevels[2], lightLevels[3], lightLevels[3], lightLevels[3]);
        
        let textureCoords = this.getTextureCoords(texture);
        this.#texCoords.push(textureCoords[1], textureCoords[2], textureCoords[0], textureCoords[2], textureCoords[1], textureCoords[3], textureCoords[0], textureCoords[3]);
        return this;
    }

    addNorthFace(x, y, z, texture, lightLevelMultiplier, blockpos, chunk) {
        this.#vertices.push(x, y, z + 1, x + 1, y, z + 1, x, y + 1, z + 1, x + 1, y + 1, z + 1);
        
        let offset = this.#indices.length / 1.5;
        this.#indices.push(...[0, 1, 2, 1, 3, 2].map(x => x + offset));

        let lightLevels = this.getVertexLight(blockpos, Direction.NORTH, chunk).map(lightLevel => lightLevel * 0.8);
        this.#colors.push(lightLevels[0], lightLevels[0], lightLevels[0], lightLevels[1], lightLevels[1], lightLevels[1], lightLevels[3], lightLevels[3], lightLevels[3], lightLevels[2], lightLevels[2], lightLevels[2]);
        
        let textureCoords = this.getTextureCoords(texture);
        this.#texCoords.push(textureCoords[0], textureCoords[2], textureCoords[1], textureCoords[2], textureCoords[0], textureCoords[3], textureCoords[1], textureCoords[3]);
        return this;
    }

    addEastFace(x, y, z, texture, lightLevelMultiplier, blockpos, chunk) {
        this.#vertices.push(x, y, z + 1, x, y, z, x, y + 1, z + 1, x, y + 1, z);
        
        let offset = this.#indices.length / 1.5;
        this.#indices.push(...[0, 2, 1, 1, 2, 3].map(x => x + offset));
        
        
        let lightLevels = this.getVertexLight(blockpos, Direction.EAST, chunk).map(lightLevel => lightLevel * 0.6);
        this.#colors.push(lightLevels[1], lightLevels[1], lightLevels[1], lightLevels[0], lightLevels[0], lightLevels[0], lightLevels[2], lightLevels[2], lightLevels[2], lightLevels[3], lightLevels[3], lightLevels[3]);
        // this.#colors.push(0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6);

        let textureCoords = this.getTextureCoords(texture);
        this.#texCoords.push(textureCoords[1], textureCoords[2], textureCoords[0], textureCoords[2], textureCoords[1], textureCoords[3], textureCoords[0], textureCoords[3]);
        return this;
    }

    addBottomFace(x, y, z, texture, lightLevelMultiplier, blockpos, chunk) {
        this.#vertices.push(x, y, z, x + 1, y, z, x, y, z + 1, x + 1, y, z + 1);
        
        let offset = this.#indices.length / 1.5;
        this.#indices.push(...[0, 1, 3, 0, 3, 2].map(x => x + offset));
        
        let lightLevels = this.getVertexLight(blockpos, Direction.DOWN, chunk).map(lightLevel => lightLevel * 0.5);
        this.#colors.push(lightLevels[0], lightLevels[0], lightLevels[0], lightLevels[1], lightLevels[1], lightLevels[1], lightLevels[3], lightLevels[3], lightLevels[3], lightLevels[2], lightLevels[2], lightLevels[2]);
        
        let textureCoords = this.getTextureCoords(texture);
        this.#texCoords.push(textureCoords[0], textureCoords[2], textureCoords[1], textureCoords[2], textureCoords[0], textureCoords[3], textureCoords[1], textureCoords[3]);
        return this;
    }

    addSouthFace(x, y, z, texture, lightLevelMultiplier, blockpos, chunk) {
        this.#vertices.push(x, y, z, x + 1, y, z, x, y + 1, z, x + 1, y + 1, z);
        
        let offset = this.#indices.length / 1.5;
        this.#indices.push(...[0, 2, 1, 1, 2, 3].map(x => x + offset));
        
        
        let lightLevels = this.getVertexLight(blockpos, Direction.SOUTH, chunk).map(lightLevel => lightLevel * 0.8);
        this.#colors.push(lightLevels[1], lightLevels[1], lightLevels[1], lightLevels[0], lightLevels[0], lightLevels[0], lightLevels[2], lightLevels[2], lightLevels[2], lightLevels[3], lightLevels[3], lightLevels[3]);
        
        let textureCoords = this.getTextureCoords(texture);
        this.#texCoords.push(textureCoords[1], textureCoords[2], textureCoords[0], textureCoords[2], textureCoords[1], textureCoords[3], textureCoords[0], textureCoords[3]);
        return this;
    }

    addBlock(x, y, z) {
        // this.addEastFace(x, y, z);
        // this.addBottomFace(x, y, z);
        // this.addSouthFace(x, y, z);
        // this.addWestFace(x, y, z);
        // this.addTopFace(x, y, z);
        // this.addNorthFace(x, y, z);
    //    v2----- v3
    //   /|      /|
    //  v6------v7|
    //  | |     | |
    //  | |textureCoords[2]---|-|textureCoords[3]
    //  |/      |/
    //  v4------v5
        // this.#vertices.push(x, y, z, x + 1, y, z, x, y + 1, z, x + 1, y + 1, z,
        //                     x, y, z + 1, x, y, z, x, y + 1, z + 1, x, y + 1, z,
        //                     x, y, z, x + 1, y, z, x, y, z + 1, x + 1, y, z + 1,
        //                     x, y, z + 1, x + 1, y, z + 1, x, y + 1, z + 1, x + 1, y + 1, z + 1,
        //                     x + 1, y, z + 1, x + 1, y, z, x + 1, y + 1, z + 1, x + 1, y + 1, z,
        //                     x, y + 1, z, x + 1, y + 1, z, x, y + 1, z + 1, x + 1, y + 1, z + 1);
        
        // let offset = this.#indices.length / 3 * 2;
        // this.#indices.push(...[0, 2, 1, 1, 2, 3,
        //                        4, 6, 5, 5, 6, 7,
        //                        8, 9, 11, 8, 11, 10,
        //                        12, 13, 14, 13, 15, 14,
        //                        16, 17, 18, 17, 19, 18,
        //                        20, 22, 21, 21, 22, 23].map(x => x + offset));
        
        // this.#colors.push(0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8,
        //                   0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7,
        //                   0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6,
        //                   0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8,
        //                   0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7,
        //                   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
        
        // this.#texCoords.push(0, 0, 1, 0, 0, 1, 1, 1,
        //                      0, 0, 1, 0, 0, 1, 1, 1,
        //                      0, 0, 1, 0, 0, 1, 1, 1,
        //                      0, 0, 1, 0, 0, 1, 1, 1,
        //                      0, 0, 1, 0, 0, 1, 1, 1,
        //                      0, 0, 1, 0, 0, 1, 1, 1);
        return this;
    }

    get() {
        return [this.#vertices/*.map(x => x * (Math.random() * 0.2 + 0.9))*/, this.#indices, this.#colors, this.#texCoords];
    }
}