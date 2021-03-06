import Spatial_Entity from './spatial_entity.js'
import { key_input, time_info, mouse_input } from '../controller/utils.js';

/**
 * @private
 * @instance
 * @type {Mesh}
 * @memberOf Geometry_Entity
 */
const m_geometry_entity_mesh = new WeakMap();
const m_geometry_entity_material = new WeakMap();
/**
 * Represents a renderable entity
 * @class
 */
export default class Geometry_Entity extends Spatial_Entity
{
	constructor(name, data)
	{
		super(name, data);
		
		let mesh = undefined
		let material = undefined

		if(data.mesh != undefined) { mesh = data.mesh }
		if(data.material != undefined) { material = data.material }

		m_geometry_entity_mesh.set(this, mesh);
		m_geometry_entity_material.set(this, material);

		
		this.glob_key_input = key_input;
		this.glob_time_info = time_info;
		this.glob_mouse_input = mouse_input;
	}

	get material()
	{
		return m_geometry_entity_material.get(this)
	}
	set material(material)
	{
		m_geometry_entity_material.set(this, material)
	}

	get mesh()
	{
		return m_geometry_entity_mesh.get(this)
	}
	set mesh(mesh)
	{
		m_geometry_entity_mesh.set(this, mesh)
	}
}