/**
 * Represents a material.
 * @class
 */
class Material_BTF extends Material
{
    constructor(callback, name, path_texture)
    {

        super(callback, name, 'shader_vertex_btf', 'shader_fragment_btf');
        this.m_texture_color = undefined;
        this.m_shader_program.uniform_texture_color = gl.getUniformLocation(this.m_shader_program, 'texture_color');

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


        // gl.activeTexture(gl.TEXTURE0);
        // this.m_shader_program.uniform_texArray = gl.getUniformLocation(this.m_shader_program, "texArraySize");
        // console.log(this.m_shader_program.uniform_texArray)
        // console.log(gl.getParameter(gl.MAX_ARRAY_TEXTURE_LAYERS));
        // 
        // this.m_shader_program.uniform_texArray1 = gl.getUniformLocation(this.m_shader_program, "texArraySize[1]");
        // console.log(this.m_shader_program.uniform_texArray1)
   //      this.list_tex = []
   //      this.list_tex1 = []
   //      for (let i = 0; i < 2; i++) {
   //      	const texture = gl.createTexture();

   //      	this.list_tex.push(texture)
   //          gl.activeTexture(gl.TEXTURE0+i);
   //          gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.list_tex[i]);

   //          gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
   //          gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating)
   //          gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
   //          gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			// gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGB, 256, 256, 2048, 0, gl.RGB, gl.UNSIGNED_BYTE, undefined);

   //      }
   //      for (let i = 2; i < 4; i++) {
   //      	const texture = gl.createTexture();
   //      	this.list_tex1.push(texture)
   //          gl.activeTexture(gl.TEXTURE0+i);
   //          gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.list_tex1[i-2]);

   //          gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
   //          gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating)
   //          gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
   //          gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			// gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGB, 256, 256, 2048, 0, gl.RGB, gl.UNSIGNED_BYTE, undefined);

   //      }

	                gl.useProgram(this.m_shader_program);
			        	this.texture = gl.createTexture();

			        	// this.list_tex.push(texture)
			            // gl.activeTexture(gl.TEXTURE0);
			            gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.texture);
                		// gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

                		// gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.REPEAT); //Prevents s-coordinate wrapping (repeating).
			            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.REPEAT); //Prevents t-coordinate wrapping (repeating)
			            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			            // gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
						gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGB, 256, 256, 2048,  0, gl.RGB, gl.UNSIGNED_BYTE, null);


				        this.m_shader_program.uniform_texArray = gl.getUniformLocation(this.m_shader_program, 'texArray');
				        console.log(this.m_shader_program.uniform_texArray)
				    	gl.uniform1i(this.m_shader_program.uniform_texArray, 0); 

   //      this.list_tex.forEach(function(tex, i) {
   //          gl.activeTexture(gl.TEXTURE0 + i);
			// gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex);
			// const str = 'texArray['+i+']'
	  //       this.m_shader_program.uniform_texArray = gl.getUniformLocation(this.m_shader_program, str);
	  //       console.log(this.m_shader_program.uniform_texArray)
   //      	gl.uniform1i(this.m_shader_program.uniform_texArray, i); 
   //      }.bind(this))

   //      this.list_tex1.forEach(function(tex, i) {
   //          gl.activeTexture(gl.TEXTURE0 + i+2);
			// gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex);
			// const str = 'texArray['+(i+2)+']'
	  //       this.m_shader_program.uniform_texArray = gl.getUniformLocation(this.m_shader_program, str);
	  //       console.log(this.m_shader_program.uniform_texArray)
   //      	gl.uniform1i(this.m_shader_program.uniform_texArray, i+2); 
   //      }.bind(this))

  //       for (unsigned int i = 0; i < tex.size(); ++i)
		// {
		// 	gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex[i]);
		// 	std::string t = std::string("texArray[") + std::to_string(static_cast<long long>(i)) + std::string("]");
		// 	GLuint tLoc = glGetUniformLocation (btfProgramID, t.c_str());
		// 	glProgramUniform1i (btfProgramID, tLoc, i);	

	 //        this.m_shader_program.uniform_texArray1 = gl.getUniformLocation(this.m_shader_program, "texArray[1]");
	 //        console.log(this.m_shader_program.uniform_texArray1)
  //       	gl.uniform1i(this.m_shader_program.uniform_texArraySize, this.texArraySize); 
		// }

        // console.log(this.list_tex)
        // console.log(this.list_tex1)
        //////////////////////////////////////////////
    	gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.texture);
        // gl.activeTexture(gl.TEXTURE1);
        // 
        
        // use canvas to get the pixel data array of the image
        this.canvas = document.createElement('canvas');
        // console.log(canvas)
        this.canvas.width = 256;
        this.canvas.height = 256;
        this.ctx = this.canvas.getContext('2d');
        // 
        // 
        this.number_of_loaded_images = 0;
        this.counter = 0;
        this.counterTa = 0;
        this.texture_array = []
        this.load_next_texture()

    }

    
    load_next_texture()
    {
    	if(this.number_of_loaded_images % 500 == 0)
    	{
			console.log('loaded '+this.number_of_loaded_images+' images')
    	}
    	// console.log(glob_tex_list[this.number_of_loaded_images])
    	glob_loader_texture.load('data/textures/MANYFILES/'+glob_tex_list[this.number_of_loaded_images]).then(
	            function(image)
	            {
		            var IMAGE_SIZE = {
		                width: 256,
		                height: 256
		            };
		            this.ctx.drawImage(image, 0, 0);
		            var imageData = this.ctx.getImageData(0, 0, IMAGE_SIZE.width, IMAGE_SIZE.height);
		            let pixels = new Uint8Array(imageData.data.buffer);
	            	this.texture_array.push(pixels)

	                this.counter++

	                if (this.counter == 2)
					{
						console.log(this.texture_array[0])
						console.log(this.texture_array[1])
	                	this.finished_loading() 
					}


	                this.number_of_loaded_images++
	                if(this.number_of_loaded_images == 2)
	                // if(this.number_of_loaded_images == 6561)
	                {
	                } else {
	                	this.load_next_texture()
	                }
	            }.bind(this)
	        )
    }

    upload_properties()
    {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.m_texture_color);
    }
}