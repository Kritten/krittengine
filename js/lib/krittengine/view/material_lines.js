/**
 * Represents a material.
 * @class
 */
class Material_Lines extends Material
{
    constructor(callback, name)
    {
        super(callback, name, "shader_vertex_lines", "shader_fragment_lines");
        this.m_shader_program.uniform_depth = gl.getUniformLocation(this.m_shader_program, "depth");
        
        this.finished_loading() 
    }

    upload_properties()
    {
        // gl.uniform3f(this.m_shader_program.uniform_depth, this.m_depth[0], this.m_depth[1], this.m_depth[2]); 
    }

    set depth(depth)
    {
     //    this.m_depth = depth
     //    gl.useProgram(this.m_shader_program);
    	// gl.uniform3f(this.m_shader_program.uniform_depth, this.m_depth[0], this.m_depth[1], this.m_depth[2]); 
     //    gl.useProgram(null);
    }
}