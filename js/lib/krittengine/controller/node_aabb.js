/**
 * @class
 */
class Node_AABB 
{
	constructor(node_parent = undefined) 
	{
		this.bounding_box = new Bounding_Box();
		this.node_parent = node_parent;
		this.node_left = undefined;
		this.node_right = undefined;
	}

}