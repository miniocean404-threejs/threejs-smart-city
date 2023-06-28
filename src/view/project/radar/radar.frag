precision mediump float;

varying vec2 v_position;

uniform float u_time;
uniform float u_radius;
uniform vec3 u_color;

void main() {
    float angle = atan(v_position.x,v_position.y);
    float new_angle = mod(angle + u_time, 3.1415926 * 2.0);

    float dis = distance(vec2(0.0,0.0),v_position);

    // 外层圆环的宽度
    float borderWidth = 5.0;

    float f_opacity = 0.0;

    // 圆环上
    if(dis > u_radius - borderWidth){
        f_opacity = 1.0;
    }

    // 雷达扫描的显示
    if(dis < u_radius - borderWidth){
        f_opacity = 1.0 - new_angle;
    }

    // 雷达之外
    if(dis > u_radius){
        f_opacity = 0.0;
    }

    gl_FragColor = vec4(u_color,f_opacity);
}
