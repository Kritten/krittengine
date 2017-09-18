import { handle_gl } from './context_gl.js';

/**
 * Represents a material.
 * @class
 */
export default class Material
{
	constructor(callback, name, name_shader_vertex, name_shader_fragment)
	{
		if (new.target === Material) {
			throw new TypeError("Cannot construct Abstract instances directly");
		}
        this.m_name = name;
        this.m_is_loaded = false;
        this.callback = callback

		this.shader_vertex = this.getShader(handle_gl, name_shader_vertex);
        this.shader_fragment = this.getShader(handle_gl, name_shader_fragment);
		this.m_shader_program = handle_gl.createProgram();
        handle_gl.attachShader(this.m_shader_program, this.shader_vertex);
        handle_gl.attachShader(this.m_shader_program, this.shader_fragment);
        handle_gl.linkProgram(this.m_shader_program);
        
        if (!handle_gl.getProgramParameter(this.m_shader_program, handle_gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        handle_gl.useProgram(this.m_shader_program);

        this.m_shader_program.uniform_matrix_perspective = handle_gl.getUniformLocation(this.m_shader_program, "matrix_perspective");
        this.m_shader_program.uniform_matrix_modelview = handle_gl.getUniformLocation(this.m_shader_program, "matrix_modelview");
        this.m_shader_program.uniform_matrix_view = handle_gl.getUniformLocation(this.m_shader_program, "matrix_view");
        this.m_shader_program.uniform_matrix_model = handle_gl.getUniformLocation(this.m_shader_program, "matrix_model");
        this.m_shader_program.uniform_matrix_normal = handle_gl.getUniformLocation(this.m_shader_program, "matrix_normal");

        this.m_shader_program.uniform_position_light = handle_gl.getUniformLocation(this.m_shader_program, "position_light");
	}

	upload_properties()
	{
		throw new TypeError('upload_properties()" has to be overwritten');
	}

    is_loaded()
    {
        return this.m_is_loaded
    }

    finished_loading()
    {
        this.m_is_loaded = true
        this.callback(this)
    }

	getShader(gl, id) 
	{
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

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
}