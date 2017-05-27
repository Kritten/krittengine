/**
 * @class
 */
class Node_AABB 
{
	constructor(data = undefined) 
	{
		this.m_data = data;
		this.m_node_parent = undefined;
		this.m_bounding_box = undefined;
		this.m_node_left = undefined;
		this.m_node_right = undefined;
		this.m_depth = 0;

		if(data != undefined)
		{
			this.calc_bounding_box()
		}
	}

	add_node(node_new) 
	{
		// if current node is a leaf node
		if(this.m_node_left == undefined)
		{
			this.m_node_left = node_new;
			this.m_node_left.parent = this;
			this.m_node_right = new Node_AABB(this.data);
			this.m_node_right.parent = this;

			this.m_data = undefined;
			// this.update_aabb();
		} else {
			
		}
	}

	calc_bounding_box()
	{
		// console.log(this.m_data.m_matrix_transformation);
		// console.log(this.m_data.mesh);
		// new Bounding_Box();
	}

	set parent(parent)
	{
		this.m_depth += 1;
		this.m_node_parent = parent;
	}

}