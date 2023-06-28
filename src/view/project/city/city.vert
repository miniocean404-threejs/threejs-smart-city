varying vec3 v_position;

void main() {
    v_position = position;

    // WebGL 内置矩阵：https://threejs.org/docs/index.html#api/zh/renderers/webgl/WebGLProgram
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
