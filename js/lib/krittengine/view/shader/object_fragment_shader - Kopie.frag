#define MAX_LIGHTS 8
precision mediump float;

varying vec3 passed_position;
varying vec2 passed_texture;
varying vec3 passed_normal;
varying vec3 passed_tangent;
varying vec3 passed_bitangent;

uniform mat4 normal_matrix;
uniform mat4 view_matrix;
uniform int num_of_lights;
uniform sampler2D color_texture;
uniform sampler2D normal_texture;

uniform vec4 light_positions[8];
uniform vec4 light_colors[8];

vec4 ambient_light = vec4(0.1, 0.1, 0.1, 1.0);
vec4 diffus_part = vec4(1.4);
vec4 specular_part = vec4(0.5);
float n = 32.0;


void main(void) 
{
    vec3 norm_normal = normalize(passed_normal);

    vec3 tangent = normalize(vec3((normal_matrix * vec4(passed_tangent, 0)).xyz)); 
    vec3 bitangent = normalize(vec3((normal_matrix * vec4(passed_bitangent, 0)).xyz)); 
    mat3 tangentSpace = mat3(tangent, bitangent, norm_normal);
    // normal from texture in tangentspace
    vec3 texture_normal = normalize(tangentSpace * normalize(texture2D(normal_texture, passed_texture).rgb * 2.0 - 1.0));

    vec4 texture_Color = vec4(1.0, 1.0, 1.0, 1.0);
    //vec4 texture_Color = texture2D(color_texture, vec2(passed_texture));

    vec4 linear_color = vec4(0.0);
    
    for(int i=0; i < MAX_LIGHTS; i++)
    {
        vec3 light = (view_matrix * vec4(light_positions[i].xyz, 1)).xyz;
        float distance_to_light = length(light);

        vec3 vertex_to_light = normalize(light - passed_position);

        // float dot_diffus = dot(norm_normal, vertex_to_light);
        float dot_diffus = dot(texture_normal, vertex_to_light);
        vec4 diffus = diffus_part * max(0.0, dot_diffus);


        // float dot_specular= dot(normalize(reflect(vertex_to_light, texture_normal)), normalize(passed_position));
        // vec4 specular = specular_part * pow(max(0.0, dot_specular), n);

        // linear_color += light_colors[i] * ( (diffus + specular) );
        linear_color += light_colors[i] * ( (diffus) );

        if(i + 1 == num_of_lights) break;
    }

    gl_FragColor = ambient_light + linear_color;  
    // gl_FragColor = texture_Color * (ambient_light + linear_color);  
    // gl_FragColor = vec4(texture_normal, 1.0);  
    // gl_FragColor = vec4(1.0);  
}