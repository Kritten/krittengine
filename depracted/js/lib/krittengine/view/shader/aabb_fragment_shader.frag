precision mediump float;

varying vec3 passed_position;
// varying vec2 passed_texture;
// varying vec3 passed_normal;

// uniform mat4 view_matrix;
// uniform int num_of_lights;
// uniform sampler2D uSampler;

uniform vec3 line_color;
// uniform vec4 light_colors[8];

// vec4 ambient_light = vec4(0.4, 0.4, 0.4, 1.0);
// vec4 diffus_part = vec4(1.4);
// vec4 specular_part = vec4(0.5);
// float n = 32.0;


void main(void) 
{
    gl_FragColor = vec4(vec3(line_color), 0.1);  
}