precision lowp float;

varying vec3 v_position;

uniform vec3 u_city_color;
uniform vec3 u_head_color;
uniform float u_size;

uniform float u_height;
uniform vec3 u_up_color;

void main() {
    vec3 base_color = u_city_color;

    base_color = mix(u_city_color ,u_head_color ,v_position.z / u_size);

    // 代表扫描线条的高度是多少
    if(u_height > v_position.z && u_height < v_position.z + 6.0){
        // 实现模糊颜色
        float f_index = (u_height - v_position.z) / 3.0;

        base_color = mix(u_up_color,base_color,abs(f_index - 1.0));
    }

    gl_FragColor = vec4(base_color ,1.0);
}
