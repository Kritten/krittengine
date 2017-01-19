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
class Light extends Geometry_Entity
{
	constructor(name, data)
	// constructor(name, position, rotation, scale, mesh, material, type)
	{
		super(name, data);
	
		let type = 'point'
		if(data.type != undefined) { type = data.type }

		m_light_type.set(this, type)
	}

	update_all()
	{
		// console.log("asdas")
		// this.init_vars()
		this.update()
	}
}