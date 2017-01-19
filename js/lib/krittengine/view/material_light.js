/**
 * Represents a material.
 * @class
 */
class Material_Light extends Material
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