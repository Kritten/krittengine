precision mediump float;

uniform vec2 screen_dimensions;

uniform sampler2D color_texture;
uniform int greyscale;
uniform int horizontal_mirrowed;
uniform int vertical_mirrowed;
uniform int blur;

float gaussian_weights[9];

void main(void) 
{
	gaussian_weights[0] = gaussian_weights[2] = gaussian_weights[6] = gaussian_weights[8] = 1.0/16.0;
	gaussian_weights[1] = gaussian_weights[3] = gaussian_weights[5] = gaussian_weights[7] = 1.0/8.0;
	gaussian_weights[4] = 1.0/4.0;

	vec2 tex_coords = (gl_FragCoord.xy) / screen_dimensions;

	if(horizontal_mirrowed == 1)
	{
		tex_coords = vec2(1.0-tex_coords.x, tex_coords.y);
		
	}
	if(vertical_mirrowed == 1)
	{
		tex_coords = vec2(tex_coords.x, 1.0-tex_coords.y);
		
	}

    vec3 texture_color = texture2D(color_texture, tex_coords).rgb;
	vec3 color = vec3(texture_color);


	if(blur == 1)
	{
		vec4 blurred_color = vec4(0.0);
		for(int y = -1; y <= 1; y++)
		{
			for(int x = -1; x <= 1; x++)
			{
				vec2 new_tex_coords = tex_coords * screen_dimensions;
				new_tex_coords = vec2(int(new_tex_coords.x) + x, int(new_tex_coords.y) + y) / screen_dimensions;
				vec3 tex_color = texture2D(color_texture, new_tex_coords).rgb;

				int z = 0;	
				if(y == -1) 
				{
					z = 1;
				}	
				else if(y == 0)
				{
					z = 4;
				}
				else
				{
					z = 7;
				}
			 	for (int i = 0; i < 9; i++) 
			 	{
			     	if (i == z+x) 
			     	{
						blurred_color += vec4(gaussian_weights[i] * tex_color, gaussian_weights[i]);
				        break;
			     	}
			  	}
			}
		}
		color = vec3(blurred_color.xyz/blurred_color.w);
	}

	if(greyscale == 1)
	{
		float grey_value = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
		color = vec3(grey_value);
	}

    gl_FragColor = vec4(color, 1.0);  
}