precision lowp float;

varying vec3 v_position;

uniform vec3 u_city_color;
uniform vec3 u_head_color;
uniform float u_size;

void main() {
    vec3 base_color = u_city_color;

    base_color = mix(u_city_color ,u_head_color ,v_position.z / u_size);

    gl_FragColor = vec4(base_color ,1.0);
}
