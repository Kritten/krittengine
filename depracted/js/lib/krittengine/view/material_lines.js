import Material from './material.js'
import { handle_gl } from './context_gl.js';

/**
 * Represents a material.
 * @class
 */
export default class Material_Lines extends Material
{
    constructor(callback, name)
    {
        super(callback, name, "shader_vertex_lines", "shader_fragment_lines");
        this.m_shader_program.uniform_depth = handle_gl.getUniformLocation(this.m_shader_program, "depth");
        
        this.finished_loading() 
    }

    upload_properties()
    {
        // handle_gl.uniform3f(this.m_shader_program.uniform_depth, this.m_depth[0], this.m_depth[1], this.m_depth[2]); 
    }

    set depth(depth)
    {
     //    this.m_depth = depth
     //    handle_gl.useProgram(this.m_shader_program);
    	// handle_gl.uniform3f(this.m_shader_program.uniform_depth, this.m_depth[0], this.m_depth[1], this.m_depth[2]); 
     //    handle_gl.useProgram(null);
    }
}