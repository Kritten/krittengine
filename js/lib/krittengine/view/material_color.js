/**
 * Represents a material.
 * @class
 */
class Material_Color extends Material
{
    constructor(callback, name, color)
    {
        super(callback, name, "shader_vertex_color", "shader_fragment_color");
        this.m_color = color
        this.m_shader_program.uniform_color = gl.getUniformLocation(this.m_shader_program, "color");
        gl.uniform3f(this.m_shader_program.uniform_color, color[0], color[1], color[2]); 
        this.finished_loading() 

    }

    upload_properties()
    {
    }

    set color(color)
    {
        this.m_color = color
        gl.useProgram(this.m_shader_program);
    	gl.uniform3f(this.m_shader_program.uniform_color, this.m_color[0], this.m_color[1], this.m_color[2]); 
        gl.useProgram(null);
    }
}