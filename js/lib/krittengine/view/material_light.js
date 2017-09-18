import Material from './material.js'
import { handle_gl } from './context_gl.js';

/**
 * Represents a material.
 * @class
 */
export default class Material_Light extends Material
{
    constructor(callback, name)
    {
        super(callback, name, "shader_vertex_light", "shader_fragment_light");
        this.finished_loading() 
    }

    upload_properties()
    {
    }
}