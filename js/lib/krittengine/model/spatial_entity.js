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
		
		let rotation = undefined;
		if(true)
		{

			rotation = quat.create();
			if(name=='btf')
			{
				quat.rotateY(rotation, rotation, glMatrix.toRadian(0));
				// quat3 = quat.rotateY(quat.create(), quat3, 1)
				// console.log(quat.str(quat3))
				// quat.normalize(rotation, rotation)
				quat.conjugate(rotation, rotation);
				// console.log(quat.str(quat3))
				// // quat3 = quat.conjugate(quat.create(), quat3)
				// // console.log(quat.str(quat3))
				// quat.invert(rotation, rotation)
				// quat.normalize(rotation, rotation)
				// // console.log(quat.str(quat3))
				// let matrix = mat4.fromQuat(mat4.create(), quat3);
				// console.log(matrix[2]+" "+matrix[6]+" "+matrix[10])
				// rotation = vec3.create()
				// quat.rotateY(rotation, rotation, glMatrix.toRadian(45));
				// quat.rotateZ(rotation, rotation, glMatrix.toRadian(0));
			}
		} else {
			rotation = vec3.create()
			
		}
		console.log(name)

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