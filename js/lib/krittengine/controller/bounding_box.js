/**
 * @class
 */
class Bounding_Box 
{
	constructor(corner_min, corner_max) 
	{
		this.m_corner_min = undefined;
		this.m_corner_max = undefined;
		this.m_center = vec3.create();
		this.m_bounds = vec3.create();
		this.m_matrix_transormation = mat4.create();

		this.update_size(corner_min, corner_max)
	}

	update_matrix_transformation()
	{
		// console.log(this.m_center)
		// console.log(this.m_bounds)

        mat4.fromTranslation(this.m_matrix_transormation, this.m_center);
        mat4.scale(this.m_matrix_transormation, this.m_matrix_transormation, this.m_bounds);
	}

	update_size(corner_min, corner_max)
	{
		this.m_corner_min = corner_min;
		this.m_corner_max = corner_max;

		vec3.subtract(this.m_bounds, this.m_corner_max, this.m_corner_min);
		
		vec3.scale(this.m_center, this.m_bounds, 0.5);
		vec3.add(this.m_center, this.m_corner_min, this.m_center);

		this.update_matrix_transformation();
	}
}