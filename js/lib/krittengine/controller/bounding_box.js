/**
 * @class
 */
class Bounding_Box 
{
	constructor(corner_min, corner_max) 
	{
		this.m_corner_min = corner_min;
		this.m_corner_max = corner_max;
		this.m_center = vec3.create();
		this.m_bounds = vec3.create();

		this.update_attributes()
	}

	update_attributes()
	{
		vec3.subtract(this.m_bounds, this.m_corner_max, this.m_corner_min);

		vec3.scale(this.m_center, this.m_bounds, 0.5);
		vec3.add(this.m_center, this.m_corner_min, this.m_center);
	}
}