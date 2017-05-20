/**
 * @class
 */
class Tree_AABB 
{
	constructor() 
	{
	 	this.m_node_root = new Node_AABB();
 		this.m_count_objects = 0;

	}

	add_entity(entity)
	{
		// console.log(entity)
		let node = new Node_AABB({
			data: entity
		});
		this.m_node_root.add_node(node);
		// console.log(node)
		this.m_count_objects += 1;

	}
}