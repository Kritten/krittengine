import Material from './material.js'
import { handle_gl } from './context_gl.js';

/**
 * Represents a material.
 * @class
 */
export default class Material_Texture extends Material
{
    constructor(callback, name, info_material)
    {
        super(callback, name, 'shader_vertex_texture', 'shader_fragment_texture');

        this.m_path_texture_color = info_material.path_texture_color
        this.m_path_texture_normal = info_material.path_texture_normal

        this.m_texture_color = undefined;
        this.m_shader_program.uniform_texture_color = handle_gl.getUniformLocation(this.m_shader_program, 'texture_color');
        handle_gl.uniform1i(this.m_shader_program.uniform_texture_color, 0);

        this.m_texture_normal = undefined;
        this.m_shader_program.uniform_texture_normal = handle_gl.getUniformLocation(this.m_shader_program, 'texture_normal');
        handle_gl.uniform1i(this.m_shader_program.uniform_texture_normal, 1);
    }

    texture_color_loaded(image_data)
    {
        handle_gl.useProgram(this.m_shader_program);
        handle_gl.activeTexture(handle_gl.TEXTURE0);
        var texture = handle_gl.createTexture();
        handle_gl.bindTexture(handle_gl.TEXTURE_2D, texture);
        
        handle_gl.pixelStorei(handle_gl.UNPACK_FLIP_Y_WEBGL, true);
        // let start =performance.now()
        handle_gl.texImage2D(handle_gl.TEXTURE_2D, 0, handle_gl.RGBA, handle_gl.RGBA, handle_gl.UNSIGNED_BYTE, image_data.image);
        // console.log(performance.now()-start)
        handle_gl.texParameteri(handle_gl.TEXTURE_2D, handle_gl.TEXTURE_MAG_FILTER, handle_gl.LINEAR);
        handle_gl.texParameteri(handle_gl.TEXTURE_2D, handle_gl.TEXTURE_MIN_FILTER, handle_gl.LINEAR);
        handle_gl.texParameteri(handle_gl.TEXTURE_2D, handle_gl.TEXTURE_WRAP_S, handle_gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
        handle_gl.texParameteri(handle_gl.TEXTURE_2D, handle_gl.TEXTURE_WRAP_T, handle_gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating)
                                                                              //
        handle_gl.bindTexture(handle_gl.TEXTURE_2D, null);
        this.m_texture_color = texture;
        handle_gl.useProgram(null);

        if(this.all_textures_created())
        {
            this.finished_loading() 
        }
    }
    texture_normal_loaded(image_data)
    {
        handle_gl.useProgram(this.m_shader_program);
        handle_gl.activeTexture(handle_gl.TEXTURE1);
        var texture = handle_gl.createTexture();
        handle_gl.bindTexture(handle_gl.TEXTURE_2D, texture);
        
        handle_gl.pixelStorei(handle_gl.UNPACK_FLIP_Y_WEBGL, true);
        // let start =performance.now()
        handle_gl.texImage2D(handle_gl.TEXTURE_2D, 0, handle_gl.RGBA, handle_gl.RGBA, handle_gl.UNSIGNED_BYTE, image_data.image);
        // console.log(performance.now()-start)
        handle_gl.texParameteri(handle_gl.TEXTURE_2D, handle_gl.TEXTURE_MAG_FILTER, handle_gl.LINEAR);
        handle_gl.texParameteri(handle_gl.TEXTURE_2D, handle_gl.TEXTURE_MIN_FILTER, handle_gl.LINEAR);
        handle_gl.texParameteri(handle_gl.TEXTURE_2D, handle_gl.TEXTURE_WRAP_S, handle_gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
        handle_gl.texParameteri(handle_gl.TEXTURE_2D, handle_gl.TEXTURE_WRAP_T, handle_gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating)
                                                                              //
        handle_gl.bindTexture(handle_gl.TEXTURE_2D, null);
        this.m_texture_normal = texture;
        handle_gl.useProgram(null);

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
        handle_gl.activeTexture(handle_gl.TEXTURE0);
        handle_gl.bindTexture(handle_gl.TEXTURE_2D, this.m_texture_color);
        handle_gl.activeTexture(handle_gl.TEXTURE1);
        handle_gl.bindTexture(handle_gl.TEXTURE_2D, this.m_texture_normal);
    }
}