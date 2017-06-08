/**
 * @class
 */
class Tree_AABB 
{
	constructor() 
	{
	 	this.m_node_root = undefined;
        this.m_count_objects = 0;
        this.m_depth = 0;
        // this.m_offset = vec3.create();
        this.m_offset = vec3.fromValues(0.1, 0.1, 0.1);
        this.m_vertex_array_object =  gl.createVertexArray();

        this.create_lines();
    }

    add_entity(entity)
    {
        // console.log(entity)
        let node = new Node_AABB(this.m_offset);
		node.update_data(entity);

		if(this.m_node_root == undefined)
		{
			this.m_node_root = node;
		} else {
			this.m_node_root.add_node(node);
		}
		this.m_depth = Math.max(node.m_depth, this.m_depth);

		// this.walk(this.balance_tree)

		// console.log(node)
		this.m_count_objects += 1;
	}

	balance_tree(node_aabb, func, data)
	{
        if(!node_aabb.is_leaf_node())
		{
			let ratio_volume = node_aabb.m_node_left.m_bounding_box_slim.calc_volume_ratio(node_aabb.m_node_right.m_bounding_box_slim);
			console.log(ratio_volume)
			node_aabb.m_node_left.walk(func, data);
			node_aabb.m_node_right.walk(func, data);
		}
		// console.log(node_aabb)
	}

	walk(func, data)
	{
		// if(this.m_node_root != undefined)
		// {
		// 	this.m_node_root.walk_recursive(func, data);
		// }
					// console.log('###################################')
		if(this.m_node_root != undefined)
		{
			let node_current = this.m_node_root;
			while(node_current != undefined)
			{
				if(node_current.m_is_visited == false)
				{
					// let offset = '';
					// for (var i = 0; i < node_current.m_depth; i++) {
					// 	offset += '    ';
					// }
					// if(node_current.is_leaf_node())
					// {
					// 	console.log(offset+'leaf_node on level '+node_current.m_depth + '; name: ' + node_current.m_data.m_name);
					// 	// console.log(offset+'leaf_node on level '+node_current.m_depth + '; min: ' + node_current.m_bounding_box.m_corner_min + ', max: ' + node_current.m_bounding_box.m_corner_max);
					// } else {
					// 	console.log(offset+'node on level '+node_current.m_depth);
					// 	// console.log(offset+'node on level '+node_current.m_depth + '; min: ' + node_current.m_bounding_box.m_corner_min + ', max: ' + node_current.m_bounding_box.m_corner_max)
					// }
					
					node_current.m_is_visited = true;

					if(func(node_current, data) == false) 
					{
		        		node_current = node_current.m_node_parent;
						continue;
					}
					// console.log(func)
				}

				if(node_current.m_node_left && node_current.m_node_left.m_is_visited == false)
				{
					node_current = node_current.m_node_left;
					continue;
				} 
				else if(node_current.m_node_right && node_current.m_node_right.m_is_visited == false)
				{
					node_current = node_current.m_node_right;
					continue;
				}

				if(!node_current.is_leaf_node())
				{
					node_current.m_node_left.m_is_visited = false;
					node_current.m_node_right.m_is_visited = false;
				}

		        node_current = node_current.m_node_parent;
			}

        	this.m_node_root.m_is_visited = false;

        	
		}
	}

	print_tree()
	{
		if(this.m_node_root != undefined)
		{
			this.m_node_root.print_node();
		}
	}

	create_lines()
	{
		let list_data_vertex = [];

        list_data_vertex.push(-0.5);
        list_data_vertex.push(-0.5);
        list_data_vertex.push(-0.5);

        list_data_vertex.push(0.5);
        list_data_vertex.push(-0.5);
        list_data_vertex.push(-0.5);

        list_data_vertex.push(0.5);
        list_data_vertex.push(-0.5);
        list_data_vertex.push(0.5);

        list_data_vertex.push(-0.5);
        list_data_vertex.push(-0.5);
        list_data_vertex.push(0.5);

        list_data_vertex.push(-0.5);
        list_data_vertex.push(0.5);
        list_data_vertex.push(-0.5);

        list_data_vertex.push(0.5);
        list_data_vertex.push(0.5);
        list_data_vertex.push(-0.5);

        list_data_vertex.push(0.5);
        list_data_vertex.push(0.5);
        list_data_vertex.push(0.5);

        list_data_vertex.push(-0.5);
        list_data_vertex.push(0.5);
        list_data_vertex.push(0.5);

        let list_indices = [];
        list_indices.push(0);
        list_indices.push(1);
        
        list_indices.push(1);
        list_indices.push(2);
        
        list_indices.push(2);
        list_indices.push(3);
        
        list_indices.push(3);
        list_indices.push(0);

        list_indices.push(4);
        list_indices.push(5);
        
        list_indices.push(5);
        list_indices.push(6);
        
        list_indices.push(6);
        list_indices.push(7);
        
        list_indices.push(7);
        list_indices.push(4);

        list_indices.push(0);
        list_indices.push(4);
        
        list_indices.push(1);
        list_indices.push(5);
        
        list_indices.push(2);
        list_indices.push(6);
        
        list_indices.push(3);
        list_indices.push(7);

		gl.bindVertexArray(this.m_vertex_array_object);

		let buffer_vertex_position = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer_vertex_position);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(list_data_vertex), gl.STATIC_DRAW);
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);
	    gl.enableVertexAttribArray(0);  
		
		let ebo = gl.createBuffer();
	    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
	    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,  new Uint16Array(list_indices), gl.STATIC_DRAW);
	    
		gl.bindVertexArray(null);
	    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	}
}