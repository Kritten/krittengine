precision mediump float;

// varying vec3 passed_position;
// varying vec3 passed_normal;

// uniform mat4 view_matrix;

void main(void) 
{
  //   vec3 light = (view_matrix*vec4(0,4,-5, 1)).xyz;
  //   // vec3 light = vec3(6,7,0);
  //   vec3 vertex_to_light = normalize(light - passed_position);

  //   float diffus = max(0.0, dot(passed_normal, vertex_to_light));
 	// float ambient = 0.2;
 	// float total = ambient + diffus;
    // gl_FragColor = vec4(total * vec3(1.0, 1.0, 1.0), 1.0);  
    // gl_FragColor = vec4(total * vec3(0.3, 0.3, 0.3), 1.0);  
    gl_FragColor = vec4(0.2, 0.4, 0.2, 1.0);  
}