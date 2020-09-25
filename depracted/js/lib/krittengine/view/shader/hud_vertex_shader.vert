precision mediump float;
attribute vec3 vertex_position;
//attribute vec3 vertex_normal;

// uniform mat4 orthogonal_matrix;
// uniform mat4 model_matrix;
// uniform mat4 perspective_matrix;
// uniform mat4 view_matrix;
// uniform mat4 normal_matrix;

// varying vec3 passed_position;
// varying vec3 passed_normal;

void main(void) 
{
	// vec4 normal = normal_matrix * vec4(vertex_normal , 0.0);
	// passed_normal = normalize(normal.xyz);
	// passed_position = (view_matrix * model_matrix * vec4(vertex_position, 1.0)).xyz;
	// gl_Position = perspective_matrix * vec4(passed_position, 1.0);
	gl_Position = vec4(vertex_position, 1.0);
}