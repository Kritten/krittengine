/**
 * @private
 * @instance
 * @type {Mesh}
 * @memberOf Mesh
 */
// const m_mesh_name = new WeakMap();
// const m_buffer_vertex_position = new WeakMap();
/**
 * Represents a mesh.
 * @class
 */
class Mesh
{
	constructor(callback, name, path)
	{
		this.m_name = name
		this.m_path = path
        this.m_is_loaded = false
        this.callback = callback
        // console.log('##########MESH#######'+this.m_name)
        glob_loader_mesh.load(path).then(
            function(string_mesh)
            {
            	let {list_indices, list_data_vertex} = this.parse_obj(string_mesh);

            	this.m_vertex_array_object =  gl.createVertexArray();
				gl.bindVertexArray(this.m_vertex_array_object);

				this.count_indices = list_indices.length

				this.m_buffer_vertex_position = gl.createBuffer()
				gl.bindBuffer(gl.ARRAY_BUFFER, this.m_buffer_vertex_position);
			    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(list_data_vertex), gl.STATIC_DRAW);
				gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 32, 0);
			    gl.enableVertexAttribArray(0);  
				gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 32, 12);
			    gl.enableVertexAttribArray(1);  
				gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 32, 20);
			    gl.enableVertexAttribArray(2);  

		  //   	this.m_buffer_vertex_texture_coords = gl.createBuffer()
		  //       gl.bindBuffer(gl.ARRAY_BUFFER, this.m_buffer_vertex_texture_coords);
		  //       gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(list_vertices), gl.STATIC_DRAW);
			 //    gl.enableVertexAttribArray(1);  
				// gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
				// gl.bindBuffer(gl.ARRAY_BUFFER, null);

		  //   	this.m_buffer_vertex_normal = gl.createBuffer()
		  //       gl.bindBuffer(gl.ARRAY_BUFFER, this.m_buffer_vertex_normal);
		  //       gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(list_normals), gl.STATIC_DRAW);
			 //    gl.enableVertexAttribArray(2);  
				// gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);
				// gl.bindBuffer(gl.ARRAY_BUFFER, null);

		  //   	this.m_buffer_vertex_tangent = gl.createBuffer()
		  //       gl.bindBuffer(gl.ARRAY_BUFFER, this.m_buffer_vertex_tangent);
		  //       gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(list_normals), gl.STATIC_DRAW);
			 //    gl.enableVertexAttribArray(3);  
				// gl.vertexAttribPointer(3, 3, gl.FLOAT, false, 0, 0);
				// gl.bindBuffer(gl.ARRAY_BUFFER, null);

		  //   	this.m_buffer_vertex_bitangent = gl.createBuffer()
		  //       gl.bindBuffer(gl.ARRAY_BUFFER, this.m_buffer_vertex_bitangent);
		  //       gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(list_normals), gl.STATIC_DRAW);
			 //    gl.enableVertexAttribArray(4);  
				// gl.vertexAttribPointer(4, 3, gl.FLOAT, false, 0, 0);
				// gl.bindBuffer(gl.ARRAY_BUFFER, null);
				
				this.EBO = gl.createBuffer();
			    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.EBO);
			    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,  new Uint16Array(list_indices), gl.STATIC_DRAW);
			    
				gl.bindVertexArray(null);
			    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

                this.finished_loading() 
            }.bind(this)
        )
	}

	parse_obj(string_mesh)
	{
		let tmp_list_vertices = [];
		let tmp_list_normals = [];
		let tmp_list_uvs = [];

		let list_data_vertex = [];
		let list_indices = [];

    	let lines = string_mesh.split('\n');
    	for(let i = 0; i < lines.length; i++) 
    	{
    		let line = lines[i]
    		let values = line.split(' ');

    		if(values[0] == 'v')
    		{
    			for(let j = 1; j <= 3; j++) 
    			{
    				tmp_list_vertices.push(parseFloat(values[j]));
    			}
    		}
    		else if(values[0] == 'vn')
    		{
    			for(let j = 1; j <= 3; j++) 
    			{
    				tmp_list_normals.push(parseFloat(values[j]));
    			}
    		}
    		else if(values[0] == 'vt')
    		{
    			for(let j = 1; j <= 2; j++) 
    			{
    				tmp_list_uvs.push(parseFloat(values[j]));
    			}
    		}
    		else if(values[0] == 'f')
    		{
    			for(let j = 1; j <= 3; j++) 
    			{
    				let [vertex, uv, normal] = values[j].split('/');

    				let index_vertex = parseInt(vertex) - 1;
    				let index_normal = parseInt(normal) - 1;
    				let index_uv = parseInt(uv) - 1;

    				let index_vertex_adjusted = index_vertex * 8;

    				list_data_vertex[index_vertex_adjusted] = tmp_list_vertices[index_vertex * 3];
    				list_data_vertex[index_vertex_adjusted + 1] = tmp_list_vertices[index_vertex * 3 + 1];
    				list_data_vertex[index_vertex_adjusted + 2] = tmp_list_vertices[index_vertex * 3 + 2];

    				list_data_vertex[index_vertex_adjusted + 3] = tmp_list_uvs[index_uv * 2];
    				list_data_vertex[index_vertex_adjusted + 4] = tmp_list_uvs[index_uv * 2 + 1];

    				list_data_vertex[index_vertex_adjusted + 5] = tmp_list_normals[index_normal * 3];
    				list_data_vertex[index_vertex_adjusted + 6] = tmp_list_normals[index_normal * 3 + 1];
    				list_data_vertex[index_vertex_adjusted + 7] = tmp_list_normals[index_normal * 3 + 2];

    				list_indices.push(index_vertex);
    			}
    		}
    	}
    	return {list_indices: list_indices, list_data_vertex: list_data_vertex};
	}

    is_loaded()
    {
        return this.m_is_loaded
    }

    finished_loading()
    {
        this.m_is_loaded = true
        this.callback(this)
    }
}