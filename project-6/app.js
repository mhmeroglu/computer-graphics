document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("webgl-canvas");
    const gl = canvas.getContext("webgl");

    if (!gl) {
        console.error("WebGL cannot be opened");
        return;
    }

    const vertexShaderSource = `
        attribute vec4 a_position;
        attribute vec4 a_color;
        attribute float a_pointSize;
        varying vec4 v_color;

        void main() {
            gl_Position = a_position;
            gl_PointSize = a_pointSize;
            v_color = a_color;
        }
    `;

    const fragmentShaderSource = `
        precision mediump float;
        varying vec4 v_color;

        void main() {
            gl_FragColor = v_color;
        }
    `;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    const program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    const positions = [
        // First Triangle
        -0.5, 0.5, 0.0,
        -0.5, -0.5, 0.0,
        0.0, -0.5, 0.0,

        // Second Triangle
        0.0, -0.5, 0.0,
        0.0, 0.5, 0.0,
        0.5, 0.5, 0.0
    ];

    const colors = [
        1.0, 0.0, 0.0, 1.0, // Red (First Triangle)
        0.0, 0.0, 1.0, 1.0, // Blue (First Triangle)
        0.0, 1.0, 0.0, 1.0, // Green (First Triangle)

        1.0, 1.0, 0.0, 1.0, // Yellow (Second Triangle)
        0.0, 1.0, 1.0, 1.0, // Cyan (Second Triangle)
        1.0, 0.0, 1.0, 1.0  // Magenta (Second Triangle)
    ];

    const pointSizes = [10.0, 20.0, 30.0, 15.0, 25.0, 12.0];

    const positionBuffer = createBuffer(gl, positions);
    const colorBuffer = createBuffer(gl, colors, gl.ARRAY_BUFFER, gl.FLOAT, 4);
    const pointSizeBuffer = createBuffer(gl, pointSizes, gl.ARRAY_BUFFER, gl.FLOAT, 1);

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const colorAttributeLocation = gl.getAttribLocation(program, "a_color");
    const pointSizeAttributeLocation = gl.getAttribLocation(program, "a_pointSize");

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.enableVertexAttribArray(pointSizeAttributeLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, pointSizeBuffer);
    gl.vertexAttribPointer(pointSizeAttributeLocation, 1, gl.FLOAT, false, 0, 0);

    // Drawing
    gl.clearColor(0.8, 0.8, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw TRIANGLES
    gl.drawArrays(gl.TRIANGLES, 0, positions.length / 3);

    // Draw POINTS at the corners of triangles
    gl.drawArrays(gl.POINTS, 0, positions.length / 3);

    // Draw LINES on top of triangles
    gl.drawArrays(gl.LINES, 0, positions.length / 3 * 2);

    // Draw a STRAIGHT LINE slightly above the triangles
    const lineVertices = [
        -0.7, 0.7, 0.0,
        0.7, 0.7, 0.0
    ];

    const lineColors = [0.0, 1.0, 1.0, 1.0]; // Cyan color for the line

    const linePositionBuffer = createBuffer(gl, lineVertices);
    const lineColorBuffer = createBuffer(gl, lineColors, gl.ARRAY_BUFFER, gl.FLOAT, 4);

    const linePositionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const lineColorAttributeLocation = gl.getAttribLocation(program, "a_color");

    gl.enableVertexAttribArray(linePositionAttributeLocation);
    gl.enableVertexAttribArray(lineColorAttributeLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, linePositionBuffer);
    gl.vertexAttribPointer(linePositionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, lineColorBuffer);
    gl.vertexAttribPointer(lineColorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.LINES, 0, lineVertices.length / 3);
});




function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile warning:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program link warning:", gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }

    return program;
}

function createBuffer(gl, data, target = gl.ARRAY_BUFFER, type = gl.FLOAT, size = 3) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, new Float32Array(data), gl.STATIC_DRAW);
    return buffer;
}
