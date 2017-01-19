precision mediump float;
attribute vec3 vertex_position;
attribute vec2 vertex_texture;

uniform mat4 model_matrix;
uniform mat4 perspective_matrix;
uniform mat4 view_matrix;

varying vec2 passed_texture;

void main(void) 
{
    passed_texture = vertex_texture;
	vec3 passed_position = (view_matrix * model_matrix * vec4(vertex_position, 1.0)).xyz;
	gl_Position = perspective_matrix * vec4(passed_position, 1.0);
}