class MultiPoint {
    static VSHADER_SOURCE = 
        `attribute vec4 a_Position;
        attribute vec4 a_Color;
        uniform mat4 u_xformMatrix;
        varying vec4 v_Color;
        void main() {
          gl_Position = a_Position * u_xformMatrix;
          v_Color = a_Color;
        }`;
    
    static FSHADER_SOURCE = 
        `precision mediump float;
        uniform vec4 u_FragColor;
        varying vec4 v_Color;
        void main() {
          gl_FragColor = v_Color;
        }`;

    static Tx = 0.5;
    static Ty = 0.5;
    static Tz = 0.0;

    main() {
        const canvas = document.getElementById("canvas");
        const gl = canvas.getContext("webgl");
        
        initShaders(gl, MultiPoint.VSHADER_SOURCE, MultiPoint.FSHADER_SOURCE);
        
        const vertexCount = this.initVertexBuffers(gl);
        
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        
        const u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
        const u_xformMatrix = gl.getUniformLocation(gl.program, "u_xformMatrix");
        
        gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
        
        let xformMatrix = new Matrix4();

        let angle = 0;

        let tick = function() {
            angle = this.animate(angle);
            this.draw(gl, vertexCount, angle, modelMatrix, u_ModelMatrix);
            requestAnimationFrame(tick);
        }.bind(this);
        tick();
        
        // canvas.addEventListener("mousemove", event => {
        //   let x = event.clientX;
        //   let y = event.clientY;
        //   let rect = event.target.getBoundingClientRect();
        
        //   x -= rect.left;
        //   y -= rect.top;
        //   x -= rect.width / 2;
        //   y -= rect.height / 2;
        //   x /= rect.width / 2;
        //   y /= rect.height / -2;
          
        //   let xformMatrix = new Matrix4();
          
        //   xformMatrix.translate(x, y, 0);
        //   xformMatrix.rotate(Math.atan2(y, x) * 180 / Math.PI, 0.0, 0.0, 1.0);
        //   gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.transpose().elements);
          
        //   gl.clear(gl.COLOR_BUFFER_BIT);
        
        //   gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCount);
        // })
    }

    initVertexBuffers(gl) {
        let vertices = new Float32Array([
          -0.05, 0.05,
          -0.05, -0.05,
          0.05, 0.05,
          0.05, -0.05
        ]);
        let vertexCount = 4;
        
        let vertexBuffer = gl.createBuffer();
        
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        
        const a_Position = gl.getAttribLocation(gl.program, "a_Position");
        
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        
        
        let colors = new Float32Array([
          1.0, 0.0, 0.0, 1.0,
          0.0, 1.0, 0.0, 1.0,
          0.0, 0.0, 1.0, 1.0,
          0.0, 1.0, 1.0, 1.0
        ]);
        
        let colorBuffer = gl.createBuffer();
        
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
        
        const a_Color = gl.getAttribLocation(gl.program, "a_Color");
        
        gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Color);
        
        return vertexCount;
    }

    static ANGLE_STEP = 45.0;
    lastTime = Date.now();
    
    animate(angle) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        return (angle + (MultiPoint.ANGLE_STEP * elapsedTime) / 1000.0) % 360;
    }

    draw(gl, vertexCount, angle, modelMatrix, u_ModelMatrix) {
        modelMatrix.translate(x, y, 0);
        modelMatrix.rotate(Math.atan2(y, x) * 180 / Math.PI, 0.0, 0.0, 1.0);
        
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.transpose().elements);
        
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCount);
    }
}