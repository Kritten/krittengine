/**
 * Container for the gameobjects
 * @class
 */
class Scene 
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

		// FLAGS
		this.m_render_lights = true
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
		for (var i = 0; i < this.objects.length; i++) 
		// for(const object of this.objects)
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
		// light.mesh = this.m_scene_loader.create_mesh('light', 'data/objects/sphere.obj')
		// light.material = this.m_scene_loader.create_material('light', 'light')
		this.m_scene_loader.add_object(light)
		this.m_lights.set(light.name, light)
	}
	/**
	 * @param      {Entity}  entity    the entity to be added.
	 */
	add(entity)
	{
		this.m_objects.push(entity);
		this.m_scene_loader.add_object(entity)
		this.m_tree.add_entity(entity)

	}

	get name() { return this.m_name }
	get objects() { return this.m_objects }
	get cameras() { return this.m_cameras }
	get active_camera() { return this.m_active_camera }
	get lights() { return this.m_lights }
}