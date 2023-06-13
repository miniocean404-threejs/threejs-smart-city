void main() {
    // 内置函数 projectionMatrix modelViewMatrix
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
