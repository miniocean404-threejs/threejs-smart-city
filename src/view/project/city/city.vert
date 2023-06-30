uniform float u_time;
varying vec3 v_position;

void main() {
    // 建筑物生长变化的时间 越小越快
    float uMax = 1.0;

    v_position = position;

    // 变化的比例
    float rate = u_time / uMax ;

    // 边界条件
    if (rate > 1.0) {
        rate = 1.0;
    }

    float z = position.z * rate;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(vec2(position), z, 1.0);
}
