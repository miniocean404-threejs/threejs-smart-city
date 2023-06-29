precision lowp float;

uniform vec3 u_color;
uniform float u_opacity;

varying float v_opacity;

void main(){
    gl_FragColor = vec4(u_color,u_opacity * v_opacity);
}
