import Material from './material.js'
import { handle_gl } from './context_gl.js';


/**
 * Represents a material.
 * @class
 */
export default class extends Material
{
    constructor(callback, name, color)
    {
        super(callback, name, "shader_vertex_color", "shader_fragment_color");
        this.m_color = color
        this.m_shader_program.uniform_color = handle_gl.getUniformLocation(this.m_shader_program, "color");
        handle_gl.uniform3f(this.m_shader_program.uniform_color, color[0], color[1], color[2]); 
        this.finished_loading() 

    }

    upload_properties()
    {
        handle_gl.uniform3f(this.m_shader_program.uniform_color, this.m_color[0], this.m_color[1], this.m_color[2]); 
    }

    set color(color)
    {
        this.m_color = color
        handle_gl.useProgram(this.m_shader_program);
    	handle_gl.uniform3f(this.m_shader_program.uniform_color, this.m_color[0], this.m_color[1], this.m_color[2]); 
        handle_gl.useProgram(null);
    }
}