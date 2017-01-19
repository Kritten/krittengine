/**
 * @private
 * @instance
 * @type {Mesh}
 * @memberOf Geometry_Entity
 */
const m_geometry_entity_scale = new WeakMap();
const m_geometry_entity_mesh = new WeakMap();
const m_geometry_entity_material = new WeakMap();
/**
 * Represents a renderable entity
 * @class
 */
class Geometry_Entity extends Spatial_Entity
{
	constructor(name, data)
	{
		super(name, data);
		
		let scale = vec3.fromValues(1.0, 1.0, 1.0)
		let mesh = undefined
		let material = undefined

		if(data.scale != undefined) { scale = data.scale }
		if(data.mesh != undefined) { mesh = data.mesh }
		if(data.material != undefined) { material = data.material }

		m_geometry_entity_scale.set(this, scale);
		m_geometry_entity_mesh.set(this, mesh);
		m_geometry_entity_material.set(this, material);
	}
	
	get scale()
	{
		return m_geometry_entity_scale.get(this)
	}
	set scale(scale)
	{
		m_geometry_entity_scale.set(this, scale)
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