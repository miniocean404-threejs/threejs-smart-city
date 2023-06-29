uniform float u_time;
uniform float u_height;
varying float v_opacity;

void main(){
    v_opacity = mix(1.0,0.0,position.y / u_height);

    vec3 v_position  = position * mod(u_time,1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(v_position, 1.0);
}
