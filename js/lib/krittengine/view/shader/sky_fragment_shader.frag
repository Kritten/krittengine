precision mediump float;

// varying vec3 passed_position;
varying vec2 passed_texture;
// varying vec3 passed_normal;

// uniform mat4 view_matrix;
// uniform int num_of_lights;
uniform sampler2D uSampler;

// uniform vec4 light_positions[8];
// uniform vec4 light_colors[8];

// vec4 ambient_light = vec4(0.4, 0.4, 0.4, 1.0);
// vec4 diffus_part = vec4(1.4);
// vec4 specular_part = vec4(0.5);
// float n = 32.0;


void main(void) 
{
    // vec3 norm_normal = normalize(passed_normal);

    vec4 texture_Color = texture2D(uSampler, passed_texture);

    // vec4 linear_color = vec4(0.0);
    
    // for(int i=0; i < MAX_LIGHTS; i++)
    // {
    //     vec3 light = (view_matrix * vec4(light_positions[i].xyz, 1)).xyz;
    //     vec3 vertex_to_light = normalize(light - passed_position);

    //     float dot_diffus = dot(norm_normal, vertex_to_light);
    //     vec4 diffus = diffus_part * max(0.0, dot_diffus);

    //     float dot_specular= dot(normalize(reflect(vertex_to_light, norm_normal)), normalize(passed_position));
    //     vec4 specular = specular_part * pow(max(0.0, dot_specular), n);

    //     linear_color += light_colors[i] * ( (diffus + specular) );
    //     // linear_color += light_colors[i] * ( diffus + specular);

    //     if(i + 1 == num_of_lights) break;
    // }

    // gl_FragColor = ambient_light + linear_color;  
    // gl_FragColor = texture_Color * (ambient_light + linear_color);  

    gl_FragColor = texture_Color;  
    // gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);  
}