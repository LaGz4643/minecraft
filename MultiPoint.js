class MultiPoint {
    static VSHADER_SOURCE =
        'attribute vec4 a_Position;\n' +
        'attribute vec4 a_Color;\n' +
        'uniform mat4 u_ModelMatrix;\n' +
        'varying vec4 v_Color;\n' +
        'void main() {\n' +
        '  gl_Position = u_ModelMatrix * a_Position;\n' +
        '  v_Color = a_Color;\n' +
        '}\n';
    
    static FSHADER_SOURCE =
        'precision mediump float;\n' +
        'uniform vec4 u_FragColor;\n' +
        'varying vec4 v_Color;\n' +
        'void main() {\n' +
        '  gl_FragColor = v_Color;\n' +
        '  if (true) {\n' +
        '    gl_FragColor = vec4(1.0, 1.0, 1.0, 2.0) - v_Color;\n' +
        '  }\n' +
        '}\n';

    main() {
        const canvas = document.getElementById("canvas");
        const gl = canvas.getContext("webgl");
        
        initShaders(gl, MultiPoint.VSHADER_SOURCE, MultiPoint.FSHADER_SOURCE);
        
        const vertexCount = this.initVertexBuffers(gl);
        
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        gl.enable(gl.DEPTH_TEST);
        
        const u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
        const u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
        
        gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
        
        let modelMatrix = new Matrix4();

        let angle = 0;
            
        let lastTime = Date.now();
        let frame = () => {
            const currentTime = Date.now();
            const dt = currentTime - lastTime;
            lastTime = currentTime;
            angle = this.animate(angle, dt);
            this.draw(gl, vertexCount, angle, modelMatrix, u_ModelMatrix);
            requestAnimationFrame(frame);
        };
        frame();
    }

    initVertexBuffers(gl) {
        let vertices = new Float32Array([
            -0.5, 0.5, 0.5,
            1.0, 0.0, 0.0,
            0.0, 1.0,
            -0.5, -0.5, 0.5,
            0.0, 1.0, 0.0,
            0.0, 1.0,
            0.5, 0.5, 0.5,
            0.0, 0.0, 1.0,
            0.0, 1.0,
            0.5, -0.5, 0.5,
            0.0, 1.0, 1.0,
            0.0, 1.0,
            0.5, 0.5, -0.5,
            1.0, 1.0, 0.0,
            0.0, 1.0,
            0.5, -0.5, -0.5,
            1.0, 0.0, 1.0,
            0.0, 1.0,
            -0.5, -0.5, -0.5,
            1.0, 0.0, 0.0,
            0.0, 1.0,
            0.5, -0.5, 0.5,
            0.0, 1.0, 1.0,
            0.0, 1.0,
            -0.5, -0.5, 0.5,
            0.0, 1.0, 0.0,
            0.0, 1.0
        ]);
        let vertexCount = 9;
        const ELEMENT_SIZE = vertices.BYTES_PER_ELEMENT;
        
        let vertexBuffer = gl.createBuffer();
        let colorBuffer = gl.createBuffer();
        let texCoordBuffer = gl.createBuffer();
        
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        const a_Position = gl.getAttribLocation(gl.program, "a_Position");

        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, ELEMENT_SIZE * 8, 0);
        gl.enableVertexAttribArray(a_Position);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        const a_Color = gl.getAttribLocation(gl.program, "a_Color");
        
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, ELEMENT_SIZE * 8, ELEMENT_SIZE * 3);
        gl.enableVertexAttribArray(a_Color);
        
        return vertexCount;
    }

    static ANGLE_STEP = 45.0;
    
    animate(angle, dt) {
        return angle + (MultiPoint.ANGLE_STEP * dt) / 1000.0;
    }

    draw(gl, vertexCount, angle, modelMatrix, u_ModelMatrix) {
        modelMatrix.setRotate(angle, 1.0, 1.0, 1.0);
        modelMatrix.scale(0.1, 0.1, 0.1);
        // modelMatrix.translate(0.5, 0.0, 0.0);
        
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
        
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCount);
    }
}