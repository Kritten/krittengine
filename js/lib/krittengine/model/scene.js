import Camera from './camera.js'
import Tree_AABB from '../controller/tree_aabb.js'
import Material_Lines from '../view/material_lines.js'

/**
 * Container for the gameobjects
 * @class
 */
export default class Scene 
{
	/**
	 * @param      {String}  name    The name
	 */
	constructor(name = 'default', loader)
	{
		this.m_name = name;
		this.m_objects = [];
	 	this.m_active_camera = new Camera('default_camera', {});
		this.m_cameras = new Map();
		this.m_lights = new Map();
		this.m_scene_loader = loader;
		this.m_tree = new Tree_AABB();

		this.m_tree.material = new Material_Lines(function(){}, 'default_material_lines') 

		// FLAGS
		this.m_render_lights = true
		this.m_render_bounding_boxes = true
		this.m_depth_bounding_box_draw = Number.POSITIVE_INFINITY
	}
	/**
	 * Updates every component of the scene.
	 */
	update()
	{
		this.cameras.forEach(function(camera) {
			camera.update_all()
		})	
		this.lights.forEach(function(light) {
			light.update_all()
		})		
		for (let i = 0; i < this.objects.length; i++) 
		{
			this.objects[i].update_all()
		}
	}
	/**
	 * Adds a new camera to the scene. 
	 * The first added camera will be the active scene.
	 * @param      {Camera}  camera   The camera which should be added to the scene
	 */
	add_camera(camera)
	{
		this.m_cameras.set(camera.name, camera)

		if(this.m_cameras.size === 1)
		{
			this.m_active_camera = camera;
		}
	}
	/**
	 * Adds a new camera to the scene. 
	 * The first added camera will be the active scene.
	 * @param      {Camera}  camera   The camera which should be added to the scene
	 */
	add_light(light)
	{
		light.mesh = this.m_scene_loader.create_mesh('light', 'data/objects/sphere.obj');
		light.material = this.m_scene_loader.create_material('light', 'light');
		this.m_scene_loader.add_object(light);
		this.m_lights.set(light.name, light);
	}
	/**
	 * @param      {Entity}  entity    the entity to be added.
	 */
	add(entity)
	{
		this.m_objects.push(entity);
		this.m_scene_loader.add_object(entity)
		// if(entity.m_movable)
		{
			this.m_tree.add_entity(entity)
		}
		// console.log('######################new tree########################')
		// this.m_tree.print_tree();
		// console.log(this.m_objects.length)
	}

	get name() { return this.m_name }
	get objects() { return this.m_objects }
	get cameras() { return this.m_cameras }
	get active_camera() { return this.m_active_camera }
	get lights() { return this.m_lights }
}