uniform float u_top;
uniform float u_rotation;

void main(){
    float angle = u_rotation / 30.0;
    float new_x = position.x * cos(angle) - position.z * sin(angle);
    float new_z = position.z * cos(angle) + position.x * sin(angle);
    float new_y = position.y; // 绕 Y 轴旋转所以 Y 轴不变

    vec4 v_position = vec4(new_x, new_y + u_top, new_z, 1.0);

    gl_Position = projectionMatrix * modelViewMatrix * v_position;
}
