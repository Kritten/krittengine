/**
 * @class
 */
class Node_AABB 
{
	constructor(offset) 
	{
		this.m_data = undefined;
		this.m_node_parent = undefined;
		this.m_bounding_box = undefined;
		this.m_node_left = undefined;
		this.m_node_right = undefined;
		this.m_depth = 0;
		this.m_offset = offset;
	}

	add_node(node_new) 
	{
		// if current node is a leaf node
		if(this.is_leaf_node())
		{
			this.m_node_left = node_new;
			this.m_node_left.update_parent(this);

			this.m_node_right = new Node_AABB(this.m_offset);
			this.m_node_right.update_data(this.m_data);
			this.m_node_right.update_parent(this);

			this.sort_children();

			this.m_data = undefined;
			this.update_bounding_box();

			// console.log(this.m_node_left.m_data.m_name)
		} else {
			// console.warn('ADDING NEW NODE')
			let volume_current = this.m_bounding_box.calc_volume();
			let volume_left = node_new.m_bounding_box.calc_volume(this.m_node_left.m_bounding_box);
			let volume_right = node_new.m_bounding_box.calc_volume(this.m_node_right.m_bounding_box);
			// console.log(volume_current)
			// console.log(volume_left)
			// console.log(volume_right)

			// if new entity is far away, put current subtree in child node and add new node to other child node
			if(volume_current < volume_left && volume_current < volume_right)
			{
				// console.log("old node stays together");

				let node_subtree = new Node_AABB(this.m_offset);
				node_subtree.m_depth = this.m_depth + 1;
				// set the parent node
				// set the child node to new node
				node_subtree.m_node_left = this.m_node_left;
				this.m_node_left.update_parent(node_subtree);
				node_subtree.m_node_right = this.m_node_right;
				this.m_node_right.update_parent(node_subtree);

				node_subtree.update_bounding_box();



				// this.m_right.add_node(entity);
				// this.m_left = node_subtree;
				this.m_node_left = node_subtree;
				node_subtree.update_parent(this);
				// this.m_left.add_node(entity);
				this.m_node_right = node_new;
				node_new.update_parent(this);

				// this.update_aabb();
				this.update_bounding_box();

			} else {
				if(volume_left < volume_right)
				{
					this.m_node_left.add_node(node_new);
				} else {
					this.m_node_right.add_node(node_new);
				}
				this.update_bounding_box();
			}
		}
	}

	walk(func, data)
	{
		func(this, func, data);
	}

	sort_children()
	{
		// vec3.subtract(difference, this.m_node_right.m_bounding_box.m_center, this.m_node_left.m_bounding_box.m_center);	
		let counter = 0;
		if(this.m_node_right.m_bounding_box.m_center[0] < this.m_node_left.m_bounding_box.m_center[0])
		{
			counter += 1;
		}
		if(this.m_node_right.m_bounding_box.m_center[1] < this.m_node_left.m_bounding_box.m_center[1])
		{
			counter += 1;
		}
		if(this.m_node_right.m_bounding_box.m_center[2] < this.m_node_left.m_bounding_box.m_center[2])
		{
			counter += 1;
		}

		if(counter > 1)
		{
			let node_tmp = this.m_node_left;
			this.m_node_left = this.m_node_right;
			this.m_node_right = node_tmp;
		}
	}
	update_bounding_box()
	{
		if(this.is_leaf_node())
		{
			let corner_min = vec3.fromValues(-0.5, -0.5, -0.5);
			let corner_max = vec3.fromValues(0.5, 0.5, 0.5);
			vec3.transformMat4(corner_min, corner_min, this.m_data.m_matrix_transformation);
			vec3.transformMat4(corner_max, corner_max, this.m_data.m_matrix_transformation);
			this.m_bounding_box = new Bounding_Box(corner_min, corner_max);
		} else {
			let corner_min = vec3.create();
			let corner_max = vec3.create();
    		vec3.min(corner_min, this.m_node_left.m_bounding_box.m_corner_min, this.m_node_right.m_bounding_box.m_corner_min);
    		vec3.max(corner_max, this.m_node_left.m_bounding_box.m_corner_max, this.m_node_right.m_bounding_box.m_corner_max);

    		vec3.sub(corner_min, corner_min, this.m_offset);
    		vec3.add(corner_max, corner_max, this.m_offset);

    		if(this.m_bounding_box == undefined)
    		{
    			this.m_bounding_box = new Bounding_Box(corner_min, corner_max); 
    		} else {
    			this.m_bounding_box.update_size(corner_min, corner_max);
    		}
		}
	}

	update_parent(node_parent)
	{
		this.m_depth = node_parent.m_depth + 1;
		this.m_node_parent = node_parent;
	}

	is_leaf_node()
	{
		return this.m_node_left == undefined;
	}

	print_node()
	{
		let offset = '';
		for (var i = 0; i < this.m_depth; i++) {
			offset += '  ';
		}
		if(this.is_leaf_node())
		{
			console.log(offset+'leaf_node on level '+this.m_depth + '; name: ' + this.m_data.m_name);
			// console.log(offset+'leaf_node on level '+this.m_depth + '; min: ' + this.m_bounding_box.m_corner_min + ', max: ' + this.m_bounding_box.m_corner_max);
		} else {
			console.log(offset+'node on level '+this.m_depth);
			// console.log(offset+'node on level '+this.m_depth + '; min: ' + this.m_bounding_box.m_corner_min + ', max: ' + this.m_bounding_box.m_corner_max)
			this.m_node_left.print_node();
			this.m_node_right.print_node();
		}

	}

	update_data(data)
	{
		this.m_data = data;
		this.update_bounding_box()
	}
}