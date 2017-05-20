/**
 * @class
 */
class Node_AABB 
{
	constructor(data = {}) 
	{
		this.m_data = undefined;
		if(data.data != undefined) { this.m_data = data.data }

		this.m_node_parent = undefined;
		if(data.node_parent != undefined) { this.m_node_parent = data.node_parent }

		this.m_bounding_box = new Bounding_Box();
		this.m_node_left = undefined;
		this.m_node_right = undefined;
		this.m_depth = 0;
	}

	add_node(node_new) 
	{
		if(this.m_node_left == undefined)
		{
			this.m_node_left = node_new;
			node_new.m_node_parent = this;
			this.m_depth = this.m_depth + 1;
		} else {
			
		}
	}
}

// AABBNode.prototype.add_node = function(entity)
// {
// 	// if current node is a leaf node
// 	if(this.m_left == undefined)
// 	{
// 		var sorted_entities = this.sort_entities(entity, this.m_data);
// 		this.m_left = new AABBNode(sorted_entities[0], this, this.m_camera);
// 		this.m_right = new AABBNode(sorted_entities[1], this, this.m_camera);
// 		this.m_data = undefined;
// 		// this.update_aabb();

// 		// var vol = this.calc_overlap_volume();
// 		// console.log(vol);

// 		// if(this.m_data.get)
// 	} else {
// 		var vol_old = this.calc_volume(this.m_aabb);
// 		var vol_left = this.calc_volume(entity.m_aabb, this.m_left.m_aabb);
// 		var vol_right = this.calc_volume(entity.m_aabb, this.m_right.m_aabb);

// 		// if new entity is far away, put current subtree in child node and add new node to other child node
// 		if(vol_old < vol_left && vol_old < vol_right)
// 		{
// 			console.log("old node stays together");
// 			// create new_node
// 			var new_node = new AABBNode(undefined, this, this.m_camera);	
// 			// set the parent node
// 			this.m_left.m_parent_node = new_node;
// 			this.m_right.m_parent_node = new_node;
// 			// set the child node to new node
// 			new_node.m_left = this.m_left;
// 			new_node.m_right = this.m_right;
// 			new_node.update_aabb();



// 			// this.m_right.add_node(entity);
// 			// this.m_left = new_node;
// 			this.m_right = new_node;
// 			// this.m_left.add_node(entity);
// 			this.m_left = new AABBNode(entity, this, this.m_camera);

// 			// this.update_aabb();

// 		} else {
// 			if(vol_left < vol_right)
// 			{
// 				this.m_left.add_node(entity);
// 			} else {
// 				this.m_right.add_node(entity);
// 			}
// 		}

// 	}
// 	this.update_aabb();
// }