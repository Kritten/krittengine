import Renderer_Scene from '../view/renderer_scene.js';
import Scene from '../model/scene.js';
import Loader from './loader.js';
import { time_info, key_input, mouse_input } from './utils.js';
/**
 * Main class of the engine and entry point for the user.
 * @class
 */
export default class Krittengine
{
	/**
	 * @param      {DOMElement}  canvas  The canvas the engine should draw into.
	 */
	constructor(canvas) 
	{
		// this.m_key_input = {active_keys: [], pressed_keys: []};
	 	this.m_renderer_scene = new Renderer_Scene(canvas);
	 	this.m_loader = new Loader();
	 	this.m_active_scene =  new Scene('default_scene', this.m_loader);

		this.initialize_events();

	 	this.m_scenes = new Map();
	 	this.m_scenes_array = [];

	 	this.m_times = [];
		// var measure = function() 
		// {
		//   	times.push(new Date().getTime());

		//   	if (times.length > 100) 
		// 	{
		// 		return draw();
		// 	}
		//   	requestAnimationFrame(measure);
		// };
		// measure();
	}
	draw() 
	{
		let array_tmp = this.m_times;
		// let array_tmp = this.m_times.slice(0);
		array_tmp.shift();
	  let dataset = {
	    x: [],
	    y: [],
	    type: 'bar'
	  };
	  let layout = {
	    xaxis: {
	      title: 'measurement #'
	    },
	    yaxis: {
	      title: 'iteration duration (ms)'
	    },
	    height: 250
	  };
	  let options = {
	    displayModeBar: false
	  };
	  // this.m_times.reduce(function(previous, current, i) {
	  //   dataset.x.push(i);
	  //   dataset.y.push(current - previous);
	  //   return current;
	  // }, this.m_times.shift());
	  for (var i = 0; i < array_tmp.length; i++) {
	    dataset.x.push(i);
	    dataset.y.push(array_tmp[i]);
	  }

	  Plotly.newPlot('target', [dataset], layout, options);
	}
	/**
	 * Updates the active scene and submit the scene to the {@link Renderer_Scene} for drawing.  
	 * This method is called every frame.
	 */
	update(timestamp)
	{

		// time calculations
		// const start_time = performance.now
		time_info.delta_time = timestamp - time_info.last_frame;
		time_info.time_ratio = time_info.delta_time / 1000;
		time_info.elapsed_time += time_info.delta_time; 
		time_info.last_frame = timestamp; 
		// console.log(timestamp)
		// if(time_info.delta_time > 20)
		// {
		// console.log(time_info.delta_time)
			
		// }
		// if(this.m_times.length < 100) 
		// {
		// 	this.m_times.push(time_info.delta_time);
		// }
	 //  	if(this.m_times.length == 100) 
		// {
		// 	this.draw();
		// } 
		// console.log(performance.now());
		// if(time_info.delta_time > 20)
		// 	console.log(time_info.delta_time);
		// console.log(time_info.time_ratio);

		if(key_input.active_keys[77]) // m
		{
			for (var i = 0; i < 300000000; i++) {
				i*i*i*i*i*i*i*i*i*i*i*i*i;
			}
		}
		// console.log(m_active_scene)
		this.m_active_scene.update();

		this.m_renderer_scene.render(this.m_active_scene);

		key_input.pressed_keys = [];
		mouse_input.moved =  false;
		mouse_input.offset[0] = 0.0;
		mouse_input.offset[1] = 0.0;

		// const tmp = performance.now()-timestamp;
		// console.log(tmp);
		// console.log((performance.now()-timestamp).toFixed(2)+'ms');

	  	requestAnimationFrame(this.update.bind(this));
	}	


	// render(timestamp) 
	// {
	// 	this.update(timestamp);
	//   	requestAnimationFrame(this.render.bind(this));
	// };

	/**
	 * Starts the main loop after all default entities were loaded
	 * @param      {function}  func   The main loop-function 
	 */
	// start(func)
	// {
	// 	if(this.m_loader.is_loading_defaults())
	// 	{
	// 		setTimeout(function() {
	// 			this.start(func);
	// 		}.bind(this), 0)
	// 	} 
	// 	else {
	// 		console.log('started engine');
	// 		func(performance.now())
	// 	}
	// }
	start()
	{
		if(this.m_loader.is_loading_defaults())
		{
			// console.log('waiting for defaults');
			setTimeout(this.start.bind(this), 0)
		} 
		else {
			// console.log('started engine');
			requestAnimationFrame(this.update.bind(this));
		}
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
	 * @param      {Scene}  name_scene   name of the scene
	 */
	get_scene(name_scene)
	{
		return this.m_scenes.get(name_scene);
	}

	set_active_scene(name_scene)
	{
		this.m_active_scene = this.m_scenes.get(name_scene);
	}

	next_scene()
	{
		let next_scene = undefined 
		for (var i = 0; i < this.m_scenes_array.length; i++) {
			if(this.m_scenes_array[i].name == this.m_active_scene.name)
			{
				if(i == this.m_scenes_array.length - 1)
				{
					next_scene = this.m_scenes_array[0]
				} else {
					next_scene = this.m_scenes_array[i + 1]
				}
			}
		}
		this.m_active_scene = next_scene;
	}
	prev_scene()
	{
		let prev_scene = undefined 
		for (var i = 0; i < this.m_scenes_array.length; i++) {
			if(this.m_scenes_array[i].name == this.m_active_scene.name)
			{
				if(i == 0)
				{
					prev_scene = this.m_scenes_array[this.m_scenes_array.length - 1]
				} else {
					prev_scene = this.m_scenes_array[i - 1]
				}
			}
		}
		this.m_active_scene = prev_scene;
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
		return this.m_loader.get_material(name_material)
	}

	lock_mouse()
	{
		canvas.requestPointerLock();
	}

	handle_mouse_move(event)
	{
		mouse_input.offset[0] = event.movementX;
		mouse_input.offset[1] = event.movementY;
		mouse_input.moved = true;
	}

	handle_pointerlock_change(event)
	{
		// console.log(event)
		// console.log(document.pointerLockElement)
		if(document.pointerLockElement === canvas || document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas) 
		{
			console.log("mouse locked");
			canvas.addEventListener("mousemove", this.handle_mouse_move, false);
		} else {
			console.log("mouse unlocked");
			// mouse_input.moved = false;
			canvas.removeEventListener("mousemove", this.handle_mouse_move, false);
		}
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
		this.update_cameras(screen.width/screen.height);
		return this.m_renderer_scene.screen_resized(screen.width, screen.height);
	}

	end_fullscreen(is_triggered_by_event = false)
	{
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }

		if(is_triggered_by_event)
        {
        	this.update_cameras(640/360);
			return this.m_renderer_scene.screen_resized(640, 360);
        }
	}

	/**
	 * Instantly notices and saves the holded key.
	 * @param      {KeyboardEvent}  event   The keyboard event
	 */
	handleKeyDown(event)
	{
		key_input.active_keys[event.keyCode] = true;
	}
	/**
	 * Keeps track of released keys.  
	 * Notices and saves shortly pressed keys. 
	 * @param      {KeyboardEvent}  event   The keyboard event
	 */
	handleKeyUp(event)
	{
		key_input.pressed_keys[event.keyCode] = true;
		key_input.active_keys[event.keyCode] = false;
	}
	handle_fullscreen_change(event)
	{
		let is_fullscreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
		if(!is_fullscreen)
		{
			this.end_fullscreen(true);
			console.log('fullscreen ended')
		} else {

			this.lock_mouse()
			console.log('fullscreen started')
		}
	}
	initialize_events()
	{
		document.onkeydown = (event) => this.handleKeyDown(event)
		document.onkeyup = (event) => this.handleKeyUp(event)

		let is_set_fullscrenchange = false;
		if(document.onfullscreenchange === null) {
			document.onfullscreenchange = (event) => this.handle_fullscreen_change(event)
			is_set_fullscrenchange = true;
		} else if(document.onmozfullscreenchange === null) {
			document.onmozfullscreenchange = (event) => this.handle_fullscreen_change(event)
			is_set_fullscrenchange = true;
		} else if(document.onwebkitfullscreenchange === null) {
			document.onwebkitfullscreenchange = (event) => this.handle_fullscreen_change(event)
			is_set_fullscrenchange = true;
		}
		if(!is_set_fullscrenchange)
		{
			console.warn('failed to set fullscreen-event');
		}

		document.onpointerlockchange = (event) => this.handle_pointerlock_change(event)
	}

	update_cameras(aspect_ratio)
	{
		this.m_scenes_array.forEach(function(scene) {
			scene.cameras.forEach(function(camera) {
				camera.update_aspect_ratio(aspect_ratio);
			})
		})
	}

	get loader() { return m_loader }
}