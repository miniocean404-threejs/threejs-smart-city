uniform float u_time;
uniform vec3 u_max;
uniform vec3 u_min;
uniform vec3 u_live_color;
uniform vec3 line_color; // 之前线框的颜色

varying vec3 v_color;

void main() {
    // 获取小数点后边数值
    float new_time = mod(u_time, 1.0);
    // 扫描的位置的百分比      mix 公式：x*(1−a)+y*a
    float rangeY = mix(u_min.y, u_max.y, new_time);

    // 在当前区间内显示扫描光带
    if (rangeY > position.y - 200.0 && rangeY < position.y) {
        // 利用正弦公式创建左右模糊，中间清楚的颜色
        float f_blur = 1.0 - sin((position.y - rangeY) / 200.0 * 3.14);

        float r = mix(u_live_color.r, line_color.r, f_blur);
        float g = mix(u_live_color.g, line_color.g, f_blur);
        float b = mix(u_live_color.b, line_color.b, f_blur);

        v_color = vec3(r, g, b);
    } else {
        v_color = line_color;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
