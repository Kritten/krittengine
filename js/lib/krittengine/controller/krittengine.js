/**
 * @private
 * @instance
 * @type {Object}
 * @memberOf Krittengine
 */
const m_key_input = new WeakMap();
/**
 * @private
 * @instance
 * @type {Renderer_Scene}
 * @memberOf Krittengine
 */
const m_renderer_scene = new WeakMap();
/**
 * @private
 * @instance
 * @type {Scene}
 * @memberOf Krittengine
 */
const m_active_scene = new WeakMap();
/**
 * @private
 * @instance
 * @type {Map<String, Scene>}
 * @memberOf Krittengine
 */
const m_scenes = new WeakMap();
/**
 * @private
 * @instance
 * @type {Map<String, Scene>}
 * @memberOf Krittengine
 */
const m_scenes_array = new WeakMap();
/**
 * @private
 * @instance
 * @type {Loader}
 * @memberOf Krittengine
 */
const m_loader = new WeakMap();

/**
 * Main class of the engine and entry point for the user.
 * @class
 */
class Krittengine 
{
	/**
	 * @param      {DOMElement}  canvas  The canvas the engine should draw into.
	 */
	constructor(canvas) 
	{
		m_key_input.set(this, {active_keys: [], pressed_keys: []})

		this.initialize_events();

	 	m_renderer_scene.set(this, new Renderer_Scene(canvas));

	 	const scene_default = new Scene(m_loader.get(this))
	 	m_active_scene.set(this, scene_default);

	 	m_scenes.set(this, new Map());
	 	m_scenes_array.set(this, []);

	 	m_loader.set(this, new Loader);
	}
	/**
	 * Updates the active scene and submit the scene to the {@link Renderer_Scene} for drawing.  
	 * This method is called every frame.
	 */
	update(timestamp)
	{
		// time calculations
		// const start_time = performance.now
		glob_time_info.delta_time = timestamp - glob_time_info.last_frame;
		glob_time_info.time_ratio = glob_time_info.delta_time / 1000;
		glob_time_info.elapsed_time += glob_time_info.delta_time; 
		glob_time_info.last_frame = timestamp; 
		// console.log(performance.now());
		// if(glob_time_info.delta_time > 20)
		// 	console.log(glob_time_info.delta_time);
		// console.log(glob_time_info.time_ratio);

		if(glob_key_input.active_keys[77]) // m
		{
			for (var i = 0; i < 30000000; i++) {
				i*i
			}
		}
		// console.log(m_active_scene.get(this))
		m_active_scene.get(this).update();

		m_renderer_scene.get(this).render(m_active_scene.get(this));

		glob_key_input.pressed_keys = [];
		const tmp = performance.now()-timestamp;
		// console.log(tmp);
		// console.log((performance.now()-timestamp).toFixed(2)+'ms');
	}	

	/**
	 * Starts the main loop after all default entities were loaded
	 * @param      {function}  func   The main loop-function 
	 */
	start(func)
	{
		if(m_loader.get(this).is_loading_defaults())
		{
			console.log('still loading defaults')
			setTimeout(function(){this.start(func)}.bind(this), 0)
		} else {
			console.log('started engine')
			func(performance.now())
		}
		// while(loading)
		// {
		// 	counter++;
		// 	if(counter == 100)
		// 	{
		// 		loading = false
		// 	}
		// }
		// setTimeout(function(){func(performance.now());}, 50)
	}
	/**
	 * Returns a mesh object. Creates this mesh if it was not created.
	 * @param      {Mesh}  name_mesh   name of the mesh
	 */
	create_mesh(name_mesh, info_mesh)
	{
		return m_loader.get(this).create_mesh(name_mesh, info_mesh)
	}
	/**
	 * Returns a mesh object. Creates this mesh if it was not created.
	 * @param      {Mesh}  name_mesh   name of the mesh
	 */
	get_mesh(name_mesh)
	{
		return m_loader.get(this).get_mesh(name_mesh)
	}
	/**
	 * Returns a scene object. Creates this scene if it was not created.
	 * The first created scene will be the first active scene
	 * @param      {Scene}  name_scene   name of the scene
	 */
	create_scene(name_scene)
	{
		const scene = new Scene(name_scene, m_loader.get(this))

		m_scenes.get(this).set(scene.name, scene)
		m_scenes_array.get(this).push(scene)

		if(m_scenes.get(this).size === 1)
		{
			m_active_scene.set(this, scene);
		}

		return scene
	}
	/**
	 * Returns a scene object. Creates this scene if it was not created.
	 * The first created scene will be the first active scene
	 * @param      {Scene}  name_scene   name of the scene
	 */
	get_scene(name_scene)
	{
		return m_scenes.get(this).get(scene.name)
	}

	set_active_scene(name_scene)
	{
		m_active_scene.set(this, m_scenes.get(this).get(name_scene));
	}

	next_scene()
	{
		let next_scene = undefined 
		for (var i = 0; i < m_scenes_array.get(this).length; i++) {
			if(m_scenes_array.get(this)[i].name == m_active_scene.get(this).name)
			{
				if(i == m_scenes_array.get(this).length - 1)
				{
					next_scene = m_scenes_array.get(this)[0]
				} else {
					next_scene = m_scenes_array.get(this)[i + 1]
				}
			}
		}
		m_active_scene.set(this, next_scene);
	}
	prev_scene()
	{
		let prev_scene = undefined 
		for (var i = 0; i < m_scenes_array.get(this).length; i++) {
			if(m_scenes_array.get(this)[i].name == m_active_scene.get(this).name)
			{
				if(i == 0)
				{
					prev_scene = m_scenes_array.get(this)[m_scenes_array.get(this).length - 1]
				} else {
					prev_scene = m_scenes_array.get(this)[i - 1]
				}
			}
		}
		m_active_scene.set(this, prev_scene);
	}
	/**
	 * Returns a material object. Creates this material if it was not created.
	 * @param      {Material}  name_material   name of the material
	 */
	create_material(type, name_material, info_material)
	{
		return m_loader.get(this).create_material(type, name_material, info_material)
	}
	/**
	 * Returns a material object. Creates this material if it was not created.
	 * @param      {Material}  name_material   name of the material
	 */
	get_material(name_material)
	{
		return m_loader.get(this).get_material(name_material)
	}

	start_fullscreen()
	{
		
		return m_renderer_scene.get(this).start_fullscreen();
	}

	end_fullscreen()
	{
		
		return m_renderer_scene.get(this).end_fullscreen();
	}

	/**
	 * Instantly notices and saves the holded key.
	 * @param      {KeyboardEvent}  event   The keyboard event
	 */
	handleKeyDown(event)
	{
		glob_key_input.active_keys[event.keyCode] = true;
	}
	/**
	 * Keeps track of released keys.  
	 * Notices and saves shortly pressed keys. 
	 * @param      {KeyboardEvent}  event   The keyboard event
	 */
	handleKeyUp(event)
	{
		glob_key_input.pressed_keys[event.keyCode] = true;
		glob_key_input.active_keys[event.keyCode] = false;
	}
	handleFullscreenChange(event, d00)
	{
		let is_fullscreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
		if(is_fullscreen)
		{
		} else {
			this.end_fullscreen()
		}
	}
	initialize_events()
	{
		document.onkeydown = (event) => this.handleKeyDown(event)
		document.onkeyup = (event) => this.handleKeyUp(event)

		let is_set_fullscrenchange = false;
		if(document.onfullscreenchange === null) {
			document.onfullscreenchange = (event) => this.handleFullscreenChange(event)
			is_set_fullscrenchange = true;
		} else if(document.onmozfullscreenchange === null) {
			document.onmozfullscreenchange = (event) => this.handleFullscreenChange(event)
			is_set_fullscrenchange = true;
		} else if(document.onwebkitfullscreenchange === null) {
			document.onwebkitfullscreenchange = (event) => this.handleFullscreenChange(event)
			is_set_fullscrenchange = true;
		}
		if(!is_set_fullscrenchange)
		{
			console.warn('failed to set fullscreen-event');
		}
	}

	get loader() { return m_loader.get(this) }
}