/**
 * @private
 * @instance
 * @type {String}
 * @memberOf Scene
 */
const m_name = new WeakMap();
/**
 * @private
 * @instance
 * @type {Geometry_Entity[]}
 * @memberOf Scene
 */
const m_objects = new WeakMap();
/**
 * @private
 * @instance
 * @type {Camera}
 * @memberOf Krittengine
 */
const m_active_camera = new WeakMap();
/**
 * @private
 * @instance
 * @type {Camera[]}
 * @memberOf Scene
 */
const m_cameras = new WeakMap();
/**
 * @private
 * @instance
 * @type {Light[]}
 * @memberOf Scene
 */
const m_lights = new WeakMap();
/**
 * Container for the gameobjects
 * @class
 */
const m_scene_loader = new WeakMap();
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
		m_name.set(this, name);
		m_objects.set(this, []);
	 	m_active_camera.set(this, new Camera('default_camera', {}));
		m_cameras.set(this, new Map());
		m_lights.set(this, new Map());
		m_scene_loader.set(this, loader);
		this.render_lights = true
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
		m_cameras.get(this).set(camera.name, camera)

		if(m_cameras.get(this).size === 1)
		{
			m_active_camera.set(this, camera);
		}
	}
	/**
	 * Adds a new camera to the scene. 
	 * The first added camera will be the active scene.
	 * @param      {Camera}  camera   The camera which should be added to the scene
	 */
	add_light(light)
	{
		// light.mesh = m_scene_loader.get(this).create_mesh('light', 'data/objects/sphere.obj')
		// light.material = m_scene_loader.get(this).create_material('light', 'light')
		m_scene_loader.get(this).add_object(light)
		m_lights.get(this).set(light.name, light)
	}
	/**
	 * @param      {Entity}  entity    the entity to be added.
	 */
	add(entity)
	{
		m_objects.get(this).push(entity);
		m_scene_loader.get(this).add_object(entity)

	}

	get name() { return m_name.get(this) }
	get objects() { return m_objects.get(this) }
	get cameras() { return m_cameras.get(this) }
	get active_camera() { return m_active_camera.get(this) }
	get lights() { return m_lights.get(this) }
}