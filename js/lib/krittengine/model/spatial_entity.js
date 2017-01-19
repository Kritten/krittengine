/**
 * @private
 * @instance
 * @type {String}
 * @memberOf Spatial_Entity
 */
const m_spatial_entity_position = new WeakMap();
/**
 * @private
 * @instance
 * @type {String}
 * @memberOf Spatial_Entity
 */
const m_spatial_entity_rotation = new WeakMap();
/**
 * Represents a entity in space
 * @class
 */
class Spatial_Entity extends Entity
{
	constructor(name, data)
	{
		super(name);

		let position = vec3.create()
		let rotation = vec3.create()

		if(data.position != undefined) { position = data.position }
		if(data.rotation != undefined) { rotation = data.rotation }

		m_spatial_entity_position.set(this, position);
		m_spatial_entity_rotation.set(this, rotation);
	}

	get position()
	{
		return m_spatial_entity_position.get(this);
	}

	set position(position)
	{
		return m_spatial_entity_position.set(this, position);
	}

	get rotation()
	{
		return m_spatial_entity_rotation.get(this);
	}

	set rotation(rotation)
	{
		return m_spatial_entity_rotation.set(this, rotation);
	}
}