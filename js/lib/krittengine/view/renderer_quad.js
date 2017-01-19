class Renderer_Quad
{
	constructor(passed_viewport, passed_texture)
	{
		this.viewport = passed_viewport;
		this.texture = passed_texture;
		// var program_switcher = passed_program_switcher;
		this.m_quad_shaderprogram = this.create_quad_shaderprogram();

		this.greyscale = 0;
		this.horizontal_mirrowed = 0;
		this.vertical_mirrowed = 0;
		this.blur = 0;

		this.quad = this.create_quad();
	}
	
	render()
	{
		// program_switcher.switch_to(this.m_quad_shaderprogram);

        gl.useProgram(this.m_quad_shaderprogram);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(this.m_quad_shaderprogram.samplerUniform, 0);

        gl.uniform2f(this.m_quad_shaderprogram.screen_dimensions, this.viewport.width, this.viewport.height);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.quad.quad_vertex_buffer);
	    gl.vertexAttribPointer(this.m_quad_shaderprogram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
		
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}

	create_quad()
	{
		var quad = {};

		quad.quad_vertex_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, quad.quad_vertex_buffer);
		var quad_vertex_buffer_data = new Float32Array(
		[ 
			-1.0,  1.0, 0.0,
			 1.0,  1.0, 0.0,
			-1.0, -1.0, 0.0,

			-1.0, -1.0, 0.0,
			 1.0,  1.0, 0.0,
			 1.0, -1.0, 0.0
	     ]);

		gl.bufferData(gl.ARRAY_BUFFER, quad_vertex_buffer_data, gl.STATIC_DRAW);

		return quad;
	}

	reload_shaders()
	{
		this.m_quad_shaderprogram = create_quad_shaderprogram();
	}

	create_quad_shaderprogram()
	{
		var vertexShader = this.getShader(gl, "shader_vertex_quad");
	    var fragmentShader = this.getShader(gl, "shader_fragment_quad");

	    var shaderprogram = gl.createProgram();
	    gl.attachShader(shaderprogram, vertexShader);
	    gl.attachShader(shaderprogram, fragmentShader);
	    gl.linkProgram(shaderprogram);

	    if (!gl.getProgramParameter(shaderprogram, gl.LINK_STATUS)) 
	    {
	        alert("Could not initialise shaders");
	    }
	    shaderprogram.num_of_attributes = gl.getProgramParameter(shaderprogram, gl.ACTIVE_ATTRIBUTES);

		// program_switcher.switch_to(shaderprogram);

	    shaderprogram.vertexPositionAttribute = gl.getAttribLocation(shaderprogram, "vertex_position");
	    gl.enableVertexAttribArray(shaderprogram.vertexPositionAttribute);

        shaderprogram.screen_dimensions = gl.getUniformLocation(shaderprogram, "screen_dimensions");	 	
        shaderprogram.samplerUniform = gl.getUniformLocation(shaderprogram, "texture_color");	 	
        shaderprogram.greyscale = gl.getUniformLocation(shaderprogram, "greyscale");	 	
        shaderprogram.horizontal_mirrowed = gl.getUniformLocation(shaderprogram, "horizontal_mirrowed");	 	
        shaderprogram.vertical_mirrowed = gl.getUniformLocation(shaderprogram, "vertical_mirrowed");	 	
        shaderprogram.blur = gl.getUniformLocation(shaderprogram, "blur");	 	
	 	return shaderprogram;
	}

	getShader(gl, id) 
	{
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }
        console.log(shaderScript)
        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }
}