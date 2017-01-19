precision mediump float;
attribute vec3 vertex_position;
attribute vec2 vertex_texture;

varying vec2 passed_texture;

void main(void) 
{
	// vec4 normal = normal_matrix * vec4(vertex_normal , 0.0);
	// passed_normal = normalize(normal.xyz);
	// passed_position = (view_matrix * model_matrix * vec4(vertex_position, 1.0)).xyz;
	// gl_Position = perspective_matrix * vec4(passed_position, 1.0);
	
    // passed_texture = vertex_position.xy;
   passed_texture = vertex_texture;
	gl_Position = vec4(vertex_position, 1.0);
}