precision lowp float;

varying vec3 v_position;

uniform vec3 u_city_color;
uniform vec3 u_head_color;
uniform float u_size;

uniform float u_height;
uniform vec3 u_up_color;

void main() {
    vec3 base_color = u_city_color;
    float line_height = 6.0;

    // 使用 z 的原因是 mesh 继承了源图形的旋转角度、v_position.z / u_size 计算所占高度百分比
    base_color = mix(u_city_color, u_head_color, v_position.z / u_size);

    // 每次渲染的时候所有顶点数据已经有了，拿到当时的数据对有所顶点进行遍历判断
    // 代表扫描线条的高度是多少
    if (u_height > v_position.z && u_height < v_position.z + line_height) {
        // 实现模糊颜色
        float f_blur = (u_height - v_position.z) / line_height;

        base_color = mix(u_up_color, base_color, abs(f_blur));
    }

    gl_FragColor = vec4(base_color, 1.0);
}
