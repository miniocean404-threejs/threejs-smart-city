uniform float u_top;
uniform float u_height;

void main(){
    float f_angle = u_height / 10.0;
    float new_x = position.x * cos(f_angle) - position.z * sin(f_angle);
    float new_y = position.y;
    float new_z = position.z * cos(f_angle) + position.x * sin(f_angle);

    vec4 v_position = vec4(new_x, new_y + u_top, new_z, 1.0);

    gl_Position = projectionMatrix * modelViewMatrix * v_position;
}
