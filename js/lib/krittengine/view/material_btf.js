/**
 * Represents a material.
 * @class
 */
class Material_BTF extends Material
{
    constructor(callback, name, path_texture)
    {

        super(callback, name, 'shader_vertex_btf', 'shader_fragment_btf');
        // this.m_texture_color = undefined;
        // this.m_shader_program.uniform_texture_color = gl.getUniformLocation(this.m_shader_program, 'texture_color');

        this.texArraySize = 10
        this.m_shader_program.uniform_texArraySize = gl.getUniformLocation(this.m_shader_program, "texArraySize");
        gl.uniform1i(this.m_shader_program.uniform_texArraySize, this.texArraySize); 

        this.texCounter = 10
        this.m_shader_program.uniform_texCounter = gl.getUniformLocation(this.m_shader_program, "texCounter");
        gl.uniform1i(this.m_shader_program.uniform_texCounter, this.texCounter); 

        this.phiInterval = [360.0, 60.0, 30.0, 20.0, 18.0, 15.0]
        this.m_shader_program.uniform_phiInterval = gl.getUniformLocation(this.m_shader_program, "phiInterval");
        gl.uniform1fv(this.m_shader_program.uniform_phiInterval, this.phiInterval); 

        this.phiIntervalCount = [0.0, 1.0, 7.0, 19.0, 37.0, 57.0, 81.0]
        this.m_shader_program.uniform_phiIntervalCount = gl.getUniformLocation(this.m_shader_program, "phiIntervalCount");
        gl.uniform1fv(this.m_shader_program.uniform_phiIntervalCount, this.phiIntervalCount); 

        this.tcm = 35.0
        this.m_shader_program.uniform_tcm = gl.getUniformLocation(this.m_shader_program, "tcm");
        gl.uniform1f(this.m_shader_program.uniform_tcm, this.tcm); 


        // this.m_position_light = vec4.fromValues(-4.0, 0.0, 4.0, 1.0);
        // this.m_shader_program.uniform_position_light = gl.getUniformLocation(this.m_shader_program, 'position_light');
        // gl.uniform4f(this.m_shader_program.uniform_position_light, this.m_position_light[0], this.m_position_light[1], this.m_position_light[2], this.m_position_light[3]);

        this.enable_mipmaps = true
        // this.enable_mipmaps = false

        this.list_tex = []
        for (let i = 0; i < 4; i++) {
        	const texture = gl.createTexture();
			gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

        	this.list_tex.push(texture)
            gl.activeTexture(gl.TEXTURE0+i);
            gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.list_tex[i]);

            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.REPEAT); //Prevents s-coordinate wrapping (repeating).
            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.REPEAT); //Prevents t-coordinate wrapping (repeating)
            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            if(this.enable_mipmaps)
            {
       	 		gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            } else {
            	gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }

			gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 5, gl.RGBA8, 256, 256, 2048);
			// gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA, 256, 256, 2048,  0, gl.RGBA, gl.UNSIGNED_BYTE, null);

	        this.m_shader_program.uniform_texArray = gl.getUniformLocation(this.m_shader_program, 'texArray['+i+']');
	    	gl.uniform1i(this.m_shader_program.uniform_texArray, i); 

        }
        
        // use canvas to get the pixel data array of the image
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        this.ctx = canvas.getContext('2d');
        // 
        // 
        this.number_of_loaded_images = 0;
        this.counter = 0;
        this.counterTa = 0;
        this.array_textures = []
        this.load_next_texture()
        this.counter_mipmap = 0;
    }

    create_mipmaps()
    {
  		console.log('creating mipmaps from layer '+ this.counter_mipmap)
	    gl.useProgram(this.m_shader_program)
		gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
		gl.activeTexture(gl.TEXTURE0 + this.counter_mipmap);
   	 	gl.bindTexture(gl.TEXTURE_2D_ARRAY,  this.list_tex[this.counter_mipmap])
		gl.generateMipmap(gl.TEXTURE_2D_ARRAY);
		
		this.counter_mipmap++;
		if(this.counter_mipmap == 3)
		{
			this.finished_loading() 
			return
		}

		setTimeout(function(){this.create_mipmaps() }.bind(this), 10000);
    }

    upload_textures()
    {
    	console.log( this.counterTa)
	    gl.useProgram(this.m_shader_program)
	    gl.activeTexture(gl.TEXTURE0 + this.counterTa)
	    gl.bindTexture(gl.TEXTURE_2D_ARRAY,  this.list_tex[this.counterTa])
		gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

	    let counter = 0;

    	for(let i = 0; i < 2048; ++i)
    	{
    		gl.texSubImage3D(
                gl.TEXTURE_2D_ARRAY,
                0,
                0,
                0,
                counter,
                256,
                256,
                1,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                this.array_textures[i + this.counterTa * 2048]
            );
            counter++;

			if(i + this.counterTa * 2048 == 6560)
			{
				if(this.enable_mipmaps)
				{
					this.create_mipmaps()
				} else {
    				this.finished_loading() 
				}
    			return
			}
    	}

		this.counterTa++;
		
		gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
		setTimeout(function(){this.upload_textures() }.bind(this), 1000);
    }

    load_next_texture()
    {
    	if(this.counter % 100 == 0)
    	{
			console.log('loaded '+this.counter+' images')
    	}
    	glob_loader_texture.load('data/textures/MANYFILES_Coord/'+glob_tex_list[this.counter]).then(function(image) {
            this.ctx.drawImage(image, 0, 0);
            var imageData = this.ctx.getImageData(0, 0, 256, 256);
            let pixels = new Uint8Array(imageData.data.buffer);
        	this.array_textures.push(pixels)

            this.counter++

            if(this.counter == 6561)
			{
            	console.log('finished loading')
            	this.upload_textures()
			} else {
            	this.load_next_texture()
			}
        }.bind(this))
    }


    // get position()
    // {
    //     return this.m_position_light
    // }
    // set position(position)
    // {
    //     this.m_position_light = position
    //     gl.useProgram(this.m_shader_program);
    //     gl.uniform4f(this.m_shader_program.uniform_position_light, this.m_position_light[0], this.m_position_light[1], this.m_position_light[2], this.m_position_light[3]);
    //     gl.useProgram(null);
    // }

    upload_properties()
    {
        gl.uniform1f(this.m_shader_program.uniform_tcm, this.tcm);
        // gl.activeTexture(gl.TEXTURE0);
        // gl.bindTexture(gl.TEXTURE_2D, this.list_tex[0]);
    }
}