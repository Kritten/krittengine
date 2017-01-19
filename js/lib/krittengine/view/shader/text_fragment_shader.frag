precision mediump float;

varying vec2 passed_texture;
// varying vec3 passed_position;
// varying vec3 passed_normal;

uniform vec3 color;
uniform sampler2D texture_color;

void main(void) 
{
	// gl_FragColor = vec4(1.0,0.0, 1.0, 1.0);
    // gl_FragColor = vec4(texture2D(texture_color, passed_texture)); 
    // gl_FragColor = vec4(vec3(texture2D(texture_color, passed_texture).a), 1.0); 
    gl_FragColor = vec4(1, 1, 1, texture2D(texture_color, passed_texture).r) *vec4(color, 1.0); 
}