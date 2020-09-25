import Geometry_Entity from './geometry_entity.js';
import { key_input, time_info } from '../controller/utils.js';

/**
 * @private
 * @instance
 * @type {String}
 * @memberOf Light
 */
const m_light_type = new WeakMap();
/**
 * Represents a renderable entity
 * @class
 */
export default class Light extends Geometry_Entity
{
	constructor(name, data)
	// constructor(name, position, rotation, scale, mesh, material, type)
	{
		super(name, data);
	
		let type = 'point'
		if(data.type != undefined) { type = data.type }

		m_light_type.set(this, type)

		this.glob_key_input = key_input;
		this.glob_time_info = time_info;
	}

	update_all()
	{
		// console.log("asdas")
		// this.init_vars()
		this.update()
	}
}