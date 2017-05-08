/**
 * @private
 * @instance
 * @type {Loader}
 * @memberOf Krittengine
 */
const m_defaults = new WeakMap();
/**
 * @private
 * @instance
 * @type {Loader}
 * @memberOf Krittengine
 */
const m_materials = new WeakMap();
/**
 * @private
 * @instance
 * @type {Loader}
 * @memberOf Krittengine
 */
const m_meshes = new WeakMap();
/**
 * @private
 * @instance
 * @type {Loader}
 * @memberOf Krittengine
 */
const m_waiting_list_material = new WeakMap();
/**
 * @private
 * @instance
 * @type {Loader}
 * @memberOf Krittengine
 */
const m_waiting_list_mesh = new WeakMap();

class Loader
{
    constructor()
    {
        m_defaults.set(this, new Map());
        m_materials.set(this, new Map());
        m_meshes.set(this, new Map());
        m_waiting_list_material.set(this, new Map());
        m_waiting_list_mesh.set(this, new Map());
        this.load_defaults()
    }
    // creates the material
    create_mesh(name_mesh, info_mesh)
    {
        let mesh = undefined
        if(m_meshes.get(this).get(name_mesh) == undefined)
        {
            mesh = new Mesh(this.mesh_loaded.bind(this), name_mesh, info_mesh)
            m_meshes.get(this).set(mesh.m_name, mesh) 

            // console.log('created new mesh ' + name_mesh)
        } else {
            throw new TypeError('mesh "'+name_mesh+'" already exists')
        }
        return mesh
    }
    // creates the material
    create_material(type, name_material, info_material)
    {
        let material = undefined
        if(m_materials.get(this).get(name_material) == undefined)
        {
            if(type == 'color')
            {
                material = new Material_Color(this.material_loaded.bind(this), name_material, info_material)
            } else if(type == 'texture') {
                material = new Material_Texture(this.material_loaded.bind(this), name_material, info_material)
                let image_texture_color = m_defaults.get(this).get('default_texture_color')
                let image_texture_normal = m_defaults.get(this).get('default_texture_normal')

                if(info_material.path_texture_color != undefined)
                {
                    image_texture_color = this.get_image(info_material.path_texture_color)
                }
                if(!image_texture_color.is_loaded())
                {
                    image_texture_color.waiting_materials.push(material.texture_color_loaded.bind(material))
                } else {
                    material.texture_color_loaded(image_texture_color)
                }

                if(info_material.path_texture_normal != undefined)
                {
                    image_texture_normal = this.get_image(info_material.path_texture_normal)
                }
                if(!image_texture_normal.is_loaded())
                {
                    image_texture_normal.waiting_materials.push(material.texture_normal_loaded.bind(material))
                } else {
                    material.texture_normal_loaded(image_texture_normal)
                }

            } else if(type == 'btf') {
                material = new Material_BTF(this.material_loaded.bind(this), name_material, info_material)
            } else if(type == 'light') {
                material = new Material_Light(this.material_loaded.bind(this), name_material)
            }
            m_materials.get(this).set(material.m_name, material) 
            // console.log('created new material ' + name_material)
        } else {
            throw new TypeError('material "'+name_material+'" already exists');
        }
        return material

    }
    get_image(path)
    {
        const image_data = new Image_Data(path)
        return image_data  
    }
    get_material(name_material)
    {
        return m_materials.get(this).get(name_material)
    }
    get_mesh(name_mesh)
    {
        return m_meshes.get(this).get(name_mesh)
    }
    // checks if all default values were loaded
    is_loading_defaults()
    {
        let is_loading = false
        for(let item of m_defaults.get(this).values())
        {
            if(!item.is_loaded())
            {
                is_loading = true
                break
            }
        }

        // console.log(m_defaults.get(this).values())
        // if(m_defaults.get(this).values())
        return is_loading
    }
    // adds the material to the object or adds the object to the waiting list if the material hasn't been loaded yet
    add_object(object)
    {
        // if there was no material attached to the object
        if(object.material == undefined)
        {
            if(m_defaults.get(this).get('default_material').is_loaded()) {
                object.material = m_defaults.get(this).get('default_material')
                // console.log(object.name + ' got default material')
            } else {
                this.add_to_waiting_list_material(object, m_defaults.get(this).get('default_material'))
                // console.log(object.name + ' added to waiting list')
            }
        } else {
            if(object.material.is_loaded())
            {
                object.material = m_materials.get(this).get(object.material.m_name)
                // console.log(object.name + ' got custom material')
            } else if(m_defaults.get(this).get('default_material').is_loaded()) {
                this.add_to_waiting_list_material(object)
                // console.log(object.name + ' got default material')
                object.material = m_defaults.get(this).get('default_material')
            } else {
                this.add_to_waiting_list_material(object, m_defaults.get(this).get('default_material'))
                this.add_to_waiting_list_material(object)
            }
        }

        // if there was no material attached to the object
        if(object.mesh == undefined)
        {
            // if the default mesh is already loaded
            if(m_defaults.get(this).get('default_mesh').is_loaded()) {
                object.mesh = m_defaults.get(this).get('default_mesh')
                // console.log(object.name + ' got default mesh')
            } else {
                this.add_to_waiting_list_mesh(object, m_defaults.get(this).get('default_mesh'))
                // console.log(object.name + ' added to waiting list')
            }
        } else {
            // if the corresponding mesh is already loaded
            if(object.mesh.is_loaded())
            {
                object.mesh = m_meshes.get(this).get(object.mesh.m_name)
                // console.log(object.name + ' got custom mesh')
            // else if the default mesh is already loaded 
            } else if(m_defaults.get(this).get('default_mesh').is_loaded()) {
                this.add_to_waiting_list_mesh(object)
                // console.log(object.name + ' got default mesh')
                object.mesh = m_defaults.get(this).get('default_mesh')
            } else {
                // console.log(object.mesh)
                this.add_to_waiting_list_mesh(object, m_defaults.get(this).get('default_mesh'))
                this.add_to_waiting_list_mesh(object)
            }
        }
    }
    // adds an object to the corresponding waiting list
    add_to_waiting_list_material(object, material = object.material)
    {
        // console.log(object.name + ' now waits for ' + material.m_name)
        if(m_waiting_list_material.get(this).get(material.m_name) == undefined)
        {
            m_waiting_list_material.get(this).set(material.m_name, [])
        }
        m_waiting_list_material.get(this).get(material.m_name).push(object)    
    }
    // adds an object to the corresponding waiting list
    add_to_waiting_list_mesh(object, mesh = object.mesh)
    {
        // console.log(object.name + ' now waits for ' + mesh.m_name)
        if(m_waiting_list_mesh.get(this).get(mesh.m_name) == undefined)
        {
            m_waiting_list_mesh.get(this).set(mesh.m_name, [])
        }
        m_waiting_list_mesh.get(this).get(mesh.m_name).push(object)    
    }
    /**
     * loads the default entities like for materials and meshes
     */
    load_defaults()
    {
        // const default_material = new Material_Texture(this.default_material_loaded.bind(this), 'default_material', 'data/textures/large.jpg')   
        // const default_material = new Material_Texture(this.default_material_loaded.bind(this), 'default_material', 'data/textures/tex1.jpg')   
        const default_material = new Material_Color(this.default_material_loaded.bind(this), 'default_material', vec3.fromValues(1.0, 0.0, 1.0))   
        m_defaults.get(this).set('default_material', default_material)

        const default_mesh = new Mesh(this.default_mesh_loaded.bind(this), 'default_mesh', 'data/objects/plane.obj')  
        m_defaults.get(this).set('default_mesh', default_mesh)

        const default_texture_normal = this.get_image('data/textures/default_texture_normal.png');
        m_defaults.get(this).set('default_texture_normal', default_texture_normal)

        const default_texture_color = this.get_image('data/textures/default_texture_color.png');
        m_defaults.get(this).set('default_texture_color', default_texture_color)
    }
    // callback for the default material
    default_material_loaded(material)
    {
        m_defaults.get(this).set(material.m_name, material)

        if(m_waiting_list_material.get(this).get(material.m_name))
        {
            for (var i = 0; i <  m_waiting_list_material.get(this).get(material.m_name).length; i++)
            // for(const object of m_waiting_list_material.get(this).get(material.m_name))
            {
                let object = m_waiting_list_material.get(this).get(material.m_name)[i];
                if(object.material == undefined || !object.material.is_loaded())
                {
                    object.material = material
                    // console.log(object.name + ' got default material')
                }
            }
            m_waiting_list_material.get(this).delete(material.m_name)   
        }
    }
    // callback for a material
    material_loaded(material)
    {
        // m_materials.get(this).set(material.m_name, material) 

        if(m_waiting_list_material.get(this).get(material.m_name))
        {
            for (var i = 0; i <  m_waiting_list_material.get(this).get(material.m_name).length; i++)
            // for(const object of m_waiting_list_material.get(this).get(material.m_name))
            {
                let object = m_waiting_list_material.get(this).get(material.m_name)[i];
                object.material = material
                // console.log(object.name + ' got custom material ')
            }
            m_waiting_list_material.get(this).delete(material.m_name)  
        }

    }
    // callback for a material
    default_mesh_loaded(mesh)
    {
        m_defaults.get(this).set(mesh.m_name, mesh) 
        if(m_waiting_list_mesh.get(this).get(mesh.m_name))
        {
            for (var i = 0; i <  m_waiting_list_mesh.get(this).get(mesh.m_name).length; i++)
            // for(const object of m_waiting_list_mesh.get(this).get(mesh.m_name))
            {
                let object = m_waiting_list_mesh.get(this).get(mesh.m_name)[i];
                if(object.mesh == undefined || !object.mesh.is_loaded())
                {
                    object.mesh = mesh
                    // console.log(object.name + ' got default mesh ')
                }
            }
            m_waiting_list_mesh.get(this).delete(mesh.m_name)  
        }

    }
    // callback for a material
    mesh_loaded(mesh)
    {
        // console.log(m_waiting_list_mesh.get(this).get(mesh.m_name))

        // m_meshes.get(this).set(mesh.m_name, mesh) 

        if(m_waiting_list_mesh.get(this).get(mesh.m_name))
        {
                // let start = performance.now()
            for (var i = 0; i <  m_waiting_list_mesh.get(this).get(mesh.m_name).length; i++)
            // for(const object of m_waiting_list_mesh.get(this).get(mesh.m_name))
            {
                let object = m_waiting_list_mesh.get(this).get(mesh.m_name)[i];
                object.mesh = mesh
                // console.log(object.name + ' got custom mesh ')
            }
                // console.log(performance.now()-start)
            m_waiting_list_mesh.get(this).delete(mesh.m_name)  
        }

    }
    // get waiting_list_material() { return m_waiting_list_material.get(this) }
    // get waiting_list_mesh() { return m_waiting_list_mesh.get(this) }

}