/**
 * @class
 */
class Tree_AABB 
{
	constructor() 
	{
	 	this.m_node_root = undefined;
        this.m_count_objects = 0;
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

		// console.log(node)
		this.m_count_objects += 1;
	}

	walk(func, data)
	{
		if(this.m_node_root != undefined)
		{
			this.m_node_root.walk(func, data);
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