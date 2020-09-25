/**
 * @class
 */
export default class Bounding_Box 
{
	constructor(corner_min, corner_max) 
	{
		this.m_corner_min = vec3.create();
		this.m_corner_max = vec3.create();
		this.m_center = vec3.create();
		this.m_bounds = vec3.create();
		this.m_matrix_transormation = mat4.create();

		this.update_size(corner_min, corner_max)
	}

	calc_volume_ratio(bounding_box)
	{
		let volume1 = this.calc_volume();
		let volume2 = bounding_box.calc_volume();
		return Math.max(volume1, volume2) / Math.min(volume1, volume2)
	}

	intersects_with(bounding_box)
	{
		  return (this.m_corner_min[0] <= bounding_box.m_corner_max[0] && this.m_corner_max[0] >= bounding_box.m_corner_min[0]) &&
		         (this.m_corner_min[1] <= bounding_box.m_corner_max[1] && this.m_corner_max[1] >= bounding_box.m_corner_min[1]) &&
		         (this.m_corner_min[2] <= bounding_box.m_corner_max[2] && this.m_corner_max[2] >= bounding_box.m_corner_min[2]);
	}

	is_inside_of(bounding_box)
	{
		  return bounding_box.is_point_inside(this.m_corner_min) && bounding_box.is_point_inside(this.m_corner_max);
	}

	is_point_inside(point)
	{
  		return (point[0] >= this.m_corner_min[0] && point[0] <= this.m_corner_max[0]) &&
		       (point[1] >= this.m_corner_min[1] && point[1] <= this.m_corner_max[1]) &&
		       (point[2] >= this.m_corner_min[2] && point[2] <= this.m_corner_max[2]);
	}

	bounds_combined(bounding_box)
	{
		let corner_min = vec3.create();
		let corner_max = vec3.create();

		vec3.min(corner_min, this.m_corner_min, bounding_box.m_corner_min);
		vec3.max(corner_max, this.m_corner_max, bounding_box.m_corner_max);

		vec3.subtract(corner_min, corner_max, corner_min);

		return corner_min;
	}

	calc_volume(bounding_box = undefined)
	{
		if(bounding_box == undefined)
		{
			return this.m_bounds[0] * this.m_bounds[1] * this.m_bounds[2];
		} else {
			let corner_min = vec3.create();
			let corner_max = vec3.create();

    		vec3.min(corner_min, this.m_corner_min, bounding_box.m_corner_min);
    		vec3.max(corner_max, this.m_corner_max, bounding_box.m_corner_max);

			vec3.subtract(corner_min, corner_max, corner_min);

    		return corner_min[0] * corner_min[1] * corner_min[2]; 
		}
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
		vec3.copy(this.m_corner_min, corner_min);
		vec3.copy(this.m_corner_max, corner_max);

		vec3.subtract(this.m_bounds, this.m_corner_max, this.m_corner_min);
		
		vec3.scale(this.m_center, this.m_bounds, 0.5);
		vec3.add(this.m_center, this.m_corner_min, this.m_center);

		this.update_matrix_transformation();
	}
}