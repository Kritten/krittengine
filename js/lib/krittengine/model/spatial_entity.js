import Entity from './entity.js'
/**
 * Represents a entity in space
 * @class
 */
export default class Spatial_Entity extends Entity
{
	constructor(name, data)
	{
		super(name);

		let position = vec3.create()
		let rotation = quat.create();
		let scale = vec3.fromValues(1.0, 1.0, 1.0)

		if(data.position != undefined) { position = data.position }
		if(data.rotation != undefined) { rotation = data.rotation }
		if(data.scale != undefined) { scale = data.scale }

		this.m_position = position;
		this.m_rotation = rotation;
		this.m_scale = scale;

		this.m_node_aabb = undefined;

		this.m_matrix_transformation = mat4.create();
		this.update_matrix_transformation();
	}

	update_matrix_transformation()
	{
		mat4.fromRotationTranslationScale(this.m_matrix_transformation, this.m_rotation, this.m_position, this.m_scale)
	}

	set position(new_position)
	{
		this.m_position = new_position
		if(this.m_node_aabb != undefined)
		{
			// this.m_node_aabb.();
		}
		// console.log(this.m_node_aabb)
		this.update_matrix_transformation();
	}
	get position()
	{
		return this.m_position;
	}
}