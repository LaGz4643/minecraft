"use strict"

const VSHADER_SOURCE = 
    `attribute vec4 a_Position;
    attribute float a_PointSize;
    void main() {
      gl_Position = a_Position;
      gl_PointSize = a_PointSize;
    }`;

const FSHADER_SOURCE = 
    `precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
      gl_FragColor = u_FragColor;
    }`;


const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");


initShaderProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);

let a_Position = gl.getAttribLocation(gl.program, "a_Position");
let a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
let u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);


gl.vertexAttrib3f(a_Position, 0.0, -0.8, 0.0);
gl.vertexAttrib1f(a_PointSize, 5.0);
gl.uniform4f(u_FragColor, 0.5, 0.5, 0.5, 1.0);
gl.drawArrays(gl.POINTS, 0, 1);

gl.vertexAttrib3f(a_Position, 0.1, -0.8, 0.0);
gl.vertexAttrib1f(a_PointSize, 10.0);
gl.drawArrays(gl.POINTS, 0, 1);

const g_points = [];
const g_colors = [];
let v = 5.0;

canvas.addEventListener("mousedown", event => {
  let x = event.clientX;
  let y = event.clientY;
  let rect = event.target.getBoundingClientRect();

  x -= rect.left;
  y -= rect.top;
  x -= rect.width / 2;
  y -= rect.height / 2;
  x /= rect.width / 2;
  y /= rect.height / -2;


  if ((2.17170111288 * x) * (2.17170111288 * x) + (-0.8 - y) * (-0.8 - y) < 0.05 * 0.05) {
    v = 5;
    return;
  }
  
  if (2.17170111288 * (0.1 - x) * 2.17170111288 * (0.1 - x) + (-0.8 - y) * (-0.8 - y) < 0.05 * 0.05) {
    v = 10;
    return;
  }

  g_points.push([x, y, v]);
  if (x >= 0 && y >= 0) {
    g_colors.push([1.0, 0.0, 0.0, 1.0]);
  } else if (x < 0 && y < 0) {
    g_colors.push([0.0, 1.0, 0.0, 1.0]);
  } else {
    g_colors.push([1.0, 1.0, 1.0, 1.0]);
  }
  
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.vertexAttrib3f(a_Position, 0.0, -0.8, 0.0);
  gl.vertexAttrib1f(a_PointSize, 5.0);
  gl.uniform4f(u_FragColor, 0.5, 0.5, 0.5, 1.0);
  gl.drawArrays(gl.POINTS, 0, 1);
  
  gl.vertexAttrib3f(a_Position, 0.1, -0.8, 0.0);
  gl.vertexAttrib1f(a_PointSize, 10.0);
  gl.drawArrays(gl.POINTS, 0, 1);

  for (let i = 0; i < g_points.length; i++) {
    gl.vertexAttrib3f(a_Position, g_points[i][0], g_points[i][1], 0.0);
    gl.vertexAttrib1f(a_PointSize, g_points[i][2]);
    gl.uniform4f(u_FragColor, g_colors[i][0], g_colors[i][1], g_colors[i][2], g_colors[i][3]);
    
    gl.drawArrays(gl.POINTS, 0, 1);
  }
});
