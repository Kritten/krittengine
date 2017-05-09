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
		// this.m_key_input = {active_keys: [], pressed_keys: []};
	 	this.m_renderer_scene = new Renderer_Scene(canvas);
	 	this.m_loader = new Loader();
	 	let scene_default = new Scene(this.m_loader)
	 	this.m_active_scene = scene_default;

		this.initialize_events();



	 	this.m_scenes = new Map();
	 	this.m_scenes_array = [];

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
		// console.log(m_active_scene)
		this.m_active_scene.update();

		this.m_renderer_scene.render(this.m_active_scene);

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
		if(this.m_loader.is_loading_defaults())
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
		return this.m_loader.create_mesh(name_mesh, info_mesh)
	}
	/**
	 * Returns a mesh object. Creates this mesh if it was not created.
	 * @param      {Mesh}  name_mesh   name of the mesh
	 */
	get_mesh(name_mesh)
	{
		return this.m_loader.get_mesh(name_mesh)
	}
	/**
	 * Returns a scene object. Creates this scene if it was not created.
	 * The first created scene will be the first active scene
	 * @param      {Scene}  name_scene   name of the scene
	 */
	create_scene(name_scene)
	{
		const scene = new Scene(name_scene, this.m_loader)

		this.m_scenes.set(scene.name, scene)
		this.m_scenes_array.push(scene)

		if(this.m_scenes.size === 1)
		{
			this.m_active_scene = scene;
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
		return m_scenes.get(scene.name)
	}

	set_active_scene(name_scene)
	{
		m_active_scene = m_scenes.get(name_scene);
	}

	next_scene()
	{
		let next_scene = undefined 
		for (var i = 0; i < m_scenes_array.length; i++) {
			if(m_scenes_array[i].name == m_active_scene.name)
			{
				if(i == m_scenes_array.length - 1)
				{
					next_scene = m_scenes_array[0]
				} else {
					next_scene = m_scenes_array[i + 1]
				}
			}
		}
		m_active_scene = next_scene;
	}
	prev_scene()
	{
		let prev_scene = undefined 
		for (var i = 0; i < m_scenes_array.length; i++) {
			if(m_scenes_array[i].name == m_active_scene.name)
			{
				if(i == 0)
				{
					prev_scene = m_scenes_array[m_scenes_array.length - 1]
				} else {
					prev_scene = m_scenes_array[i - 1]
				}
			}
		}
		m_active_scene = prev_scene;
	}
	/**
	 * Returns a material object. Creates this material if it was not created.
	 * @param      {Material}  name_material   name of the material
	 */
	create_material(type, name_material, info_material)
	{
		return this.m_loader.create_material(type, name_material, info_material)
	}
	/**
	 * Returns a material object. Creates this material if it was not created.
	 * @param      {Material}  name_material   name of the material
	 */
	get_material(name_material)
	{
		return m_loader.get_material(name_material)
	}

	start_fullscreen()
	{
        if (canvas.requestFullscreen) {
          canvas.requestFullscreen();
        } else if (canvas.msRequestFullscreen) {
          canvas.msRequestFullscreen();
        } else if (canvas.mozRequestFullScreen) {
          canvas.mozRequestFullScreen();
        } else if (canvas.webkitRequestFullscreen) {
          canvas.webkitRequestFullscreen();
        } 
		
		return this.m_renderer_scene.screen_resized(screen.width, screen.height);
	}

	end_fullscreen()
	{
		
		return this.m_renderer_scene.screen_resized(800, 500);
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

	get loader() { return m_loader }
}