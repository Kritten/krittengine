precision mediump float;
attribute vec3 vertex_position;
attribute vec2 vertex_texture;
attribute vec3 vertex_normal;
attribute vec3 vertex_tangent;
attribute vec3 vertex_bitangent;

uniform mat4 model_matrix;
uniform mat4 perspective_matrix;
uniform mat4 view_matrix;
uniform mat4 normal_matrix;

varying vec3 passed_position;
varying vec3 passed_normal;
varying vec2 passed_texture;
varying vec3 passed_tangent;
varying vec3 passed_bitangent;

void main(void) 
{
    passed_texture = vertex_texture;

	vec4 normal = normal_matrix * vec4(vertex_normal , 0.0);
	passed_normal = normalize(normal.xyz);

	passed_tangent = vertex_tangent;
	passed_bitangent = vertex_bitangent;

	passed_position = (view_matrix * model_matrix * vec4(vertex_position, 1.0)).xyz;
	gl_Position = perspective_matrix * vec4(passed_position, 1.0);
}