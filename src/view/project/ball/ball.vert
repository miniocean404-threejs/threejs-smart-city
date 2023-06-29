uniform float u_time;

void main(){

    vec3 v_position  = position * mod(u_time,1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(v_position, 1.0);
}
