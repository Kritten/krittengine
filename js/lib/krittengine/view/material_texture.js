/**
 * Represents a material.
 * @class
 */
class Material_Texture extends Material
{
    constructor(callback, name)
    {
        super(callback, name, 'shader_vertex_texture', 'shader_fragment_texture');
        
        this.m_texture_color = undefined;
        this.m_shader_program.uniform_texture_color = gl.getUniformLocation(this.m_shader_program, 'texture_color');
        gl.uniform1i(this.m_shader_program.uniform_texture_color, 0);

        this.m_texture_normal = undefined;
        this.m_shader_program.uniform_texture_normal = gl.getUniformLocation(this.m_shader_program, 'texture_normal');
        gl.uniform1i(this.m_shader_program.uniform_texture_normal, 1);
    }

    texture_color_loaded(image_data)
    {
        gl.useProgram(this.m_shader_program);
        gl.activeTexture(gl.TEXTURE0);
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        // let start =performance.now()
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image_data.image);
        // console.log(performance.now()-start)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating)
                                                                              //
        gl.bindTexture(gl.TEXTURE_2D, null);
        this.m_texture_color = texture;
        gl.useProgram(null);

        if(this.all_textures_created())
        {
            this.finished_loading() 
        }
    }
    texture_normal_loaded(image_data)
    {
        gl.useProgram(this.m_shader_program);
        gl.activeTexture(gl.TEXTURE1);
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        // let start =performance.now()
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image_data.image);
        // console.log(performance.now()-start)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating)
                                                                              //
        gl.bindTexture(gl.TEXTURE_2D, null);
        this.m_texture_normal = texture;
        gl.useProgram(null);

        if(this.all_textures_created())
        {
            this.finished_loading() 
        }
    }

    all_textures_created()
    {
        if(this.m_texture_color == undefined) return false        
        if(this.m_texture_normal == undefined) return false        

        return true
    }

    upload_properties()
    {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.m_texture_color);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.m_texture_normal);
    }
}