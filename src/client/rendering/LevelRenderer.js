class LevelRenderer {
  #canvas;
  #gl;
  #vertexCount;
  #u_ViewProjectionMatrix;
  #viewProjectionMatrix = new Matrix4();

  #level;
  #chunkMeshes = [];

  constructor(level) {
    this.#level = level;
    this.rebuildChunkMeshes();
  }
  
  async init() {
    // Retrieve <canvas> element
    this.#canvas = document.getElementById('canvas');
  
    // Get the rendering context for WebGL
    this.#gl = canvas.getContext("webgl");
    if (!this.#gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }
    
    // Initialize shaders
    if (!initShaders(this.#gl, await Util.readAll("assets/shaders/shader.vsh"), await Util.readAll("assets/shaders/shader.fsh"))) {
      console.log('Failed to intialize shaders.');
      return;
    }
  
    // Set the vertex information
    this.#vertexCount = this.initVertexBuffers(this.#gl);
    if (this.#vertexCount < 0) {
      console.log('Failed to set the vertex information');
      return;
    }

    await this.initTextures(this.#gl, this.#vertexCount);
  
    // Set the clear color and enable the depth test
    this.#gl.clearColor(0.74609375, 0.84765625, 1.0, 1.0);
    this.#gl.enable(this.#gl.DEPTH_TEST);
    this.#gl.enable(this.#gl.BLEND);
    this.#gl.blendFunc(this.#gl.SRC_ALPHA, this.#gl.ONE_MINUS_SRC_ALPHA);
    // console.log(this.#gl);
    this.#gl.enable(this.#gl.CULL_FACE);
  
    // Get the storage location of u_MvpMatrix
    this.#u_ViewProjectionMatrix = this.#gl.getUniformLocation(this.#gl.program, 'u_ViewProjectionMatrix');
    if (!this.#u_ViewProjectionMatrix) {
      console.log('Failed to get the storage location of u_MvpMatrix');
      return;
    }
  }

  render(camera, fov) {
    // angle = Date.now() / 100 % 360;
    // console.log(angle);
    let cameraPos = camera.getPos();
    this.#viewProjectionMatrix.setPerspective(camera.getFov(), 1/*2.171701112877583465818759936407*/, 0.1, 10000);
    // this.viewProjectionMatrix.lookAt(cameraPos.getX(), cameraPos.getY(), cameraPos.getZ(), cameraPos.getX() - Math.cos(camera.getYaw() * (Math.PI / 180)), cameraPos.getY(), cameraPos.getZ() - Math.sin(camera.getYaw() * (Math.PI / 180)), 0, Math.sin(camera.getPitch() * (Math.PI / 180)), Math.cos(camera.getPitch() * (Math.PI / 180)));
    // console.log(camera.getYaw());
    this.#viewProjectionMatrix.rotate(camera.getPitch(), 1, 0, 0);
    this.#viewProjectionMatrix.rotate(-(camera.getYaw() + 360), 0, 1, 0);
    this.#viewProjectionMatrix.translate(-cameraPos.getX(), -cameraPos.getY(), -cameraPos.getZ());
    // this.viewProjectionMatrix.rotate(-camera.getPitch(), 1, 0, 0);
    // mvpMatrix.set(viewProjectionMatrix);
    // mvpMatrix.rotate(0.0, 0.0, 1.0, 0.0);
    this.draw(this.#gl, this.#vertexCount, this.#u_ViewProjectionMatrix, this.#viewProjectionMatrix);
  }

  draw(gl, n, u_MvpMatrix, mvpMatrix) {
      // Pass the model view projection matrix to u_MvpMatrix
      gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    
      // Clear color and depth buffer
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
      // Draw the cube
      gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
  }

  rebuildChunkMeshes() {
    this.#chunkMeshes = [];
    this.#level.getChunks().forEach((chunk, pos) => {
      this.#chunkMeshes.push(ChunkMesh.forChunk(chunk, Vec2.fromString(pos)));
    });
  }

  test() {
    this.#vertexCount = this.initVertexBuffers(this.#gl);
  }
  
  initVertexBuffers(gl) {
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    
    let mesh = this.#chunkMeshes[0].get();

    const vertices = new Float32Array(mesh[0]);
  
    const indices = new Uint16Array(mesh[1]);
  
    const colors = new Float32Array(mesh[2]);

    const texCoords = new Float32Array(mesh[3]);
  
    // Create a buffer object
    const indexBuffer = gl.createBuffer();
  
    // Write the vertex coordinates and color to the buffer object
    this.initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position');
  
    this.initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color');

    this.initArrayBuffer(gl, texCoords, 2, gl.FLOAT, 'a_TexCoord');
  
    // Write the indices to the buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
  }
  
  initArrayBuffer(gl, data, num, type, attribute) {
    const buffer = gl.createBuffer();   // Create a buffer object
    if (!buffer) {
      console.log('Failed to create the buffer object');
      return false;
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // Assign the buffer object to the attribute variable
    const a_attribute = gl.getAttribLocation(gl.program, attribute);
    if (a_attribute < 0) {
      console.log('Failed to get the storage location of ' + attribute);
      return false;
    }
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    // Enable the assignment of the buffer object to the attribute variable
    gl.enableVertexAttribArray(a_attribute);
  
    return true;
  }

  async initTextures(gl, vertexCount) {
    let texture = gl.createTexture();
    let u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    let image = new Image();
    return new Promise((resolve) => {
      image.onload = () => resolve(image);
      image.src = 'assets/textures/atlas/blocks.png';
      // resolve(image);
      // resolve(document.getElementById("input").files[0]);
    }).then(() => this.loadTexture(gl, vertexCount, texture, u_Sampler, image));
    // image.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7ac12fqebeHo76AjWlnIn-Vy5Ltzc2TUB6w&s';
  }

  loadTexture(gl, vertexCount, texture, u_Sampler, image) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler, 0);
  }
}