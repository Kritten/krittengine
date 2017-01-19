/**
 * Represents a material.
 * @class
 */
class Material
{
	constructor(callback, name, name_shader_vertex, name_shader_fragment)
	{
		if (new.target === Material) {
			throw new TypeError("Cannot construct Abstract instances directly");
		}
        this.m_name = name;
        this.m_is_loaded = false;
        this.callback = callback

		this.shader_vertex = this.getShader(gl, name_shader_vertex);
        this.shader_fragment = this.getShader(gl, name_shader_fragment);
		this.m_shader_program = gl.createProgram();
        gl.attachShader(this.m_shader_program, this.shader_vertex);
        gl.attachShader(this.m_shader_program, this.shader_fragment);
        gl.linkProgram(this.m_shader_program);
        
        if (!gl.getProgramParameter(this.m_shader_program, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(this.m_shader_program);

        this.m_shader_program.uniform_matrix_perspective = gl.getUniformLocation(this.m_shader_program, "matrix_perspective");
        this.m_shader_program.uniform_matrix_modelview = gl.getUniformLocation(this.m_shader_program, "matrix_modelview");
        this.m_shader_program.uniform_matrix_view = gl.getUniformLocation(this.m_shader_program, "matrix_view");
        this.m_shader_program.uniform_matrix_model = gl.getUniformLocation(this.m_shader_program, "matrix_model");
        this.m_shader_program.uniform_matrix_normal = gl.getUniformLocation(this.m_shader_program, "matrix_normal");

        this.m_shader_program.uniform_position_light = gl.getUniformLocation(this.m_shader_program, "position_light");
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