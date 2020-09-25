import { handle_gl } from './context_gl.js';

const m_renderer_quad_framebuffer = new WeakMap();
const m_renderer_quad_texture = new WeakMap();
const m_renderer_quad_renderbuffer = new WeakMap();
const m_renderer_quad_quad = new WeakMap();

export default class
{
	constructor()
	{
		let {framebuffer, texture, renderbuffer} = this.create_framebuffer();
        m_renderer_quad_framebuffer.set(this, framebuffer);
        m_renderer_quad_texture.set(this, texture);
        m_renderer_quad_renderbuffer.set(this, renderbuffer);

		this.m_quad_shaderprogram = this.create_quad_shaderprogram();

		// this.greyscale = 0;
		// this.horizontal_mirrowed = 0;
		// this.vertical_mirrowed = 0;
		// this.blur = 0;

		m_renderer_quad_quad.set(this, this.create_quad());
		// console.log(this)
	}

    screen_resized()
    {
        handle_gl.bindTexture(handle_gl.TEXTURE_2D, m_renderer_quad_texture.get(this));
        handle_gl.texImage2D(handle_gl.TEXTURE_2D, 0, handle_gl.RGBA, handle_gl.drawingBufferWidth, handle_gl.drawingBufferHeight, 0, handle_gl.RGBA, handle_gl.UNSIGNED_BYTE, null);

        handle_gl.bindRenderbuffer(handle_gl.RENDERBUFFER, m_renderer_quad_renderbuffer.get(this));
        handle_gl.renderbufferStorage(handle_gl.RENDERBUFFER, handle_gl.DEPTH_COMPONENT16, handle_gl.drawingBufferWidth, handle_gl.drawingBufferHeight);
    }
	
	render()
	{
		// program_switcher.switch_to(this.m_quad_shaderprogram);
        handle_gl.useProgram(this.m_quad_shaderprogram);

        handle_gl.activeTexture(handle_gl.TEXTURE0);
        handle_gl.bindTexture(handle_gl.TEXTURE_2D, m_renderer_quad_texture.get(this));
        handle_gl.uniform1i(this.m_quad_shaderprogram.samplerUniform, 0);

        handle_gl.uniform2f(this.m_quad_shaderprogram.screen_dimensions, handle_gl.drawingBufferWidth, handle_gl.drawingBufferHeight);

		handle_gl.bindBuffer(handle_gl.ARRAY_BUFFER, m_renderer_quad_quad.get(this).quad_vertex_buffer);
	    handle_gl.vertexAttribPointer(this.m_quad_shaderprogram.vertexPositionAttribute, 3, handle_gl.FLOAT, false, 0, 0);
		
		handle_gl.drawArrays(handle_gl.TRIANGLES, 0, 6);
	}

	create_quad()
	{
		let quad = {};

		quad.quad_vertex_buffer = handle_gl.createBuffer();
		handle_gl.bindBuffer(handle_gl.ARRAY_BUFFER, quad.quad_vertex_buffer);
		let quad_vertex_buffer_data = new Float32Array(
		[ 
			-1.0,  1.0, 0.0,
			 1.0,  1.0, 0.0,
			-1.0, -1.0, 0.0,

			-1.0, -1.0, 0.0,
			 1.0,  1.0, 0.0,
			 1.0, -1.0, 0.0
	     ]);

		handle_gl.bufferData(handle_gl.ARRAY_BUFFER, quad_vertex_buffer_data, handle_gl.STATIC_DRAW);

		return quad;
	}

	reload_shaders()
	{
		this.m_quad_shaderprogram = create_quad_shaderprogram();
	}

	create_quad_shaderprogram()
	{
		var vertexShader = this.getShader(handle_gl, "shader_vertex_quad");
	    var fragmentShader = this.getShader(handle_gl, "shader_fragment_quad");

	    var shaderprogram = handle_gl.createProgram();
	    handle_gl.attachShader(shaderprogram, vertexShader);
	    handle_gl.attachShader(shaderprogram, fragmentShader);
	    handle_gl.linkProgram(shaderprogram);

	    if (!handle_gl.getProgramParameter(shaderprogram, handle_gl.LINK_STATUS)) 
	    {
	        alert("Could not initialise shaders");
	    }
	    shaderprogram.num_of_attributes = handle_gl.getProgramParameter(shaderprogram, handle_gl.ACTIVE_ATTRIBUTES);

		// program_switcher.switch_to(shaderprogram);

	    shaderprogram.vertexPositionAttribute = handle_gl.getAttribLocation(shaderprogram, "vertex_position");
	    handle_gl.enableVertexAttribArray(shaderprogram.vertexPositionAttribute);

        shaderprogram.screen_dimensions = handle_gl.getUniformLocation(shaderprogram, "screen_dimensions");	 	
        shaderprogram.samplerUniform = handle_gl.getUniformLocation(shaderprogram, "texture_color");	 	
        // shaderprogram.greyscale = handle_gl.getUniformLocation(shaderprogram, "greyscale");	 	
        // shaderprogram.horizontal_mirrowed = handle_gl.getUniformLocation(shaderprogram, "horizontal_mirrowed");	 	
        // shaderprogram.vertical_mirrowed = handle_gl.getUniformLocation(shaderprogram, "vertical_mirrowed");	 	
        // shaderprogram.blur = handle_gl.getUniformLocation(shaderprogram, "blur");	 	
	 	return shaderprogram;
	}

	getShader(gl, id) 
	{
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }
        // console.log(shaderScript)
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
            shader = handle_gl.createShader(handle_gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = handle_gl.createShader(handle_gl.VERTEX_SHADER);
        } else {
            return null;
        }

        handle_gl.shaderSource(shader, str);
        handle_gl.compileShader(shader);

        if (!handle_gl.getShaderParameter(shader, handle_gl.COMPILE_STATUS)) {
            alert(handle_gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }
    create_framebuffer()
    {
        // create framebuffer
    	let framebuffer = handle_gl.createFramebuffer();
        handle_gl.bindFramebuffer(handle_gl.FRAMEBUFFER, framebuffer);
        // init the framebuffer-texture
        let texture = handle_gl.createTexture();
        handle_gl.bindTexture(handle_gl.TEXTURE_2D, texture);
        handle_gl.texParameteri(handle_gl.TEXTURE_2D, handle_gl.TEXTURE_MAG_FILTER, handle_gl.NEAREST);
        handle_gl.texParameteri(handle_gl.TEXTURE_2D, handle_gl.TEXTURE_MIN_FILTER, handle_gl.NEAREST);
        handle_gl.texParameteri(handle_gl.TEXTURE_2D, handle_gl.TEXTURE_WRAP_S, handle_gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
        handle_gl.texParameteri(handle_gl.TEXTURE_2D, handle_gl.TEXTURE_WRAP_T, handle_gl.CLAMP_TO_EDGE); 
        handle_gl.texImage2D(handle_gl.TEXTURE_2D, 0, handle_gl.RGBA, handle_gl.drawingBufferWidth, handle_gl.drawingBufferHeight, 0, handle_gl.RGBA, handle_gl.UNSIGNED_BYTE, null);
        // init depthbuffer
        let renderbuffer = handle_gl.createRenderbuffer();
        handle_gl.bindRenderbuffer(handle_gl.RENDERBUFFER, renderbuffer);
        handle_gl.renderbufferStorage(handle_gl.RENDERBUFFER, handle_gl.DEPTH_COMPONENT16, handle_gl.drawingBufferWidth, handle_gl.drawingBufferHeight);
        // 
        handle_gl.framebufferTexture2D(handle_gl.FRAMEBUFFER, handle_gl.COLOR_ATTACHMENT0, handle_gl.TEXTURE_2D, texture, 0);
        handle_gl.framebufferRenderbuffer(handle_gl.FRAMEBUFFER, handle_gl.DEPTH_ATTACHMENT, handle_gl.RENDERBUFFER, renderbuffer);

        handle_gl.bindTexture(handle_gl.TEXTURE_2D, null);
        handle_gl.bindRenderbuffer(handle_gl.RENDERBUFFER, null);
        handle_gl.bindFramebuffer(handle_gl.FRAMEBUFFER, null);

        return {framebuffer, texture, renderbuffer};
    }

    get framebuffer() { return m_renderer_quad_framebuffer.get(this) }
}