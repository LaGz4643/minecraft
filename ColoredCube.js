// ColoredCube.js (c) 2012 matsuda
// Vertex shader program
class ColoredCube {
  static VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_Position = u_MvpMatrix * a_Position;\n' +
    '  v_Color = a_Color;\n' +
    '}\n';
  
  // Fragment shader program
  static FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';

  constructor() {
    this.main();
  }
  
  main() {
    // Retrieve <canvas> element
    const canvas = document.getElementById('canvas');
  
    // Get the rendering context for WebGL
    const gl = canvas.getContext("webgl");
    this.gl = gl;
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }
  
    // Initialize shaders
    if (!initShaders(gl, ColoredCube.VSHADER_SOURCE, ColoredCube.FSHADER_SOURCE)) {
      console.log('Failed to intialize shaders.');
      return;
    }
  
    // Set the vertex information
    const n = this.initVertexBuffers(gl);
    this.n = n;
    if (n < 0) {
      console.log('Failed to set the vertex information');
      return;
    }
  
    // Set the clear color and enable the depth test
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
  
    // Get the storage location of u_MvpMatrix
    const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    this.u_MvpMatrix = u_MvpMatrix;
    if (!u_MvpMatrix) {
      console.log('Failed to get the storage location of u_MvpMatrix');
      return;
    }

    let x = 0;
    this.x = x;
    let y = 0;
    this.y = y;
    let z = 10;
    this.z = z;
    let angle = 0;
    this.angle = angle;
  
    // Set the eye point and the viewing volume
    const viewProjectionMatrix = new Matrix4();
    this.viewProjectionMatrix = viewProjectionMatrix;
    
    // const mvpMatrix = new Matrix4();

    
  }

  render(camera) {
    // angle = Date.now() / 100 % 360;
    // console.log(angle);
    let cameraPos = camera.getPos();
    this.viewProjectionMatrix.setPerspective(30, 1, 1, 100);
    // this.viewProjectionMatrix.lookAt(cameraPos.getX(), cameraPos.getY(), cameraPos.getZ(), cameraPos.getX() - Math.cos(camera.getYaw() * (Math.PI / 180)), cameraPos.getY(), cameraPos.getZ() - Math.sin(camera.getYaw() * (Math.PI / 180)), 0, Math.sin(camera.getPitch() * (Math.PI / 180)), Math.cos(camera.getPitch() * (Math.PI / 180)));
    // console.log(camera.getYaw());
    this.viewProjectionMatrix.rotate(camera.getPitch(), 1, 0, 0);
    this.viewProjectionMatrix.rotate(-(camera.getYaw() + 270), 0, 1, 0);
    this.viewProjectionMatrix.translate(-cameraPos.getX(), -cameraPos.getY(), -cameraPos.getZ());
    // this.viewProjectionMatrix.rotate(-camera.getPitch(), 1, 0, 0);
    // mvpMatrix.set(viewProjectionMatrix);
    // mvpMatrix.rotate(0.0, 0.0, 1.0, 0.0);
    this.draw(this.gl, this.n, this.u_MvpMatrix, this.viewProjectionMatrix);
  }

  draw(gl, n, u_MvpMatrix, mvpMatrix) {
      // Pass the model view projection matrix to u_MvpMatrix
      gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    
      // Clear color and depth buffer
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
      // Draw the cube
      gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
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
  
    const vertices = new Float32Array([   // Vertex coordinates
       1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
       1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
       1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
      -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
      -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
       1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
    ]);
  
    const colors = new Float32Array([     // Colors
      0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
      0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
      1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up(red)
      1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
      1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
      0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
    ]);
  
    const indices = new Uint8Array([       // Indices of the vertices
       0, 1, 2,   0, 2, 3,    // front
       4, 5, 6,   4, 6, 7,    // right
       8, 9,10,   8,10,11,    // up
      12,13,14,  12,14,15,    // left
      16,17,18,  16,18,19,    // down
      20,21,22,  20,22,23     // back
    ]);
  
    // Create a buffer object
    const indexBuffer = gl.createBuffer();
    if (!indexBuffer) 
      return -1;
  
    // Write the vertex coordinates and color to the buffer object
    if (!this.initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position'))
      return -1;
  
    if (!this.initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color'))
      return -1;
  
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
}