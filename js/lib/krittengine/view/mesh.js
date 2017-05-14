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
                // console.log(list_indices)
                // console.log(list_data_vertex)
                console.log('number of vertices: '+(list_data_vertex.length/8))

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
		let list_vertices = [];
		let list_normals = [];
		let list_uvs = [];

        let list_triangles = [];

    	let lines = string_mesh.split('\n');
    	for(let i = 0; i < lines.length; i++) 
    	{
    		let line = lines[i]
    		let values = line.split(' ');

    		if(values[0] == 'v')
    		{
    			list_vertices.push(vec3.fromValues(values[1], values[2], values[3]));
    		}
    		else if(values[0] == 'vn')
    		{
    			list_normals.push(vec3.fromValues(values[1], values[2], values[3]));
    		}
    		else if(values[0] == 'vt')
    		{
    			list_uvs.push(vec2.fromValues(values[1], values[2]));
    		}
    		else if(values[0] == 'f')
    		{
                let triangle = [];

    			for(let j = 1; j <= 3; j++) 
    			{
    				let [vertex, uv, normal] = values[j].split('/');

                    let index_vertex = parseInt(vertex) - 1;
                    let index_uv = parseInt(uv) - 1;
                    let index_normal = parseInt(normal) - 1;

                    triangle.push({
                        'index_vertex': index_vertex,
                        'index_uv': index_uv,
                        'index_normal': index_normal
                    });
    			}

                list_triangles.push(triangle);
    		}
    	}
        // let {list_tangents, list_bitangents} = this.calc_tangents_bitangents(list_triangles);
    		// console.log(list_vertices)
    		// console.log(list_normals)
    		// console.log(list_uvs)
    		// console.log(list_triangles)

        return this.create_data_vertex(list_triangles, list_vertices, list_uvs, list_normals);
	}
    
    calc_tangents_bitangents(list_triangles)
    {
     //    let list_tangents1 = [];
     //    for (let i = 0; i < list_triangles.length; i++) { list_tangents1.push([0.0, 0.0, 0.0]); }
     //    let list_tangents2 = [];
    	// for (let i = 0; i < list_triangles.length; i++) { list_tangents2.push([0.0, 0.0, 0.0]); }
     //    let list_bitangents = [];

     //    list_triangles.forEach(function(triangle) {
     //    	let vert1 = [];
    	// });

     //    return {list_tangents: list_tangents1, list_bitangents: list_bitangents};
    }

    create_data_vertex(list_triangles, list_vertices, list_uvs, list_normals)
    {
        let list_tangents1 = [];
        for (let i = 0; i < list_vertices.length; i++) { list_tangents1.push([vec3.create(), vec3.create()]); }
        let list_tangents2 = [];
    	for (let i = 0; i < list_vertices.length; i++) { list_tangents2.push([vec3.create(), vec3.create()]); }


        list_triangles.forEach(function(triangle) {
        	let vert1 = list_vertices[triangle[0].index_vertex];
        	let vert2 = list_vertices[triangle[1].index_vertex];
        	let vert3 = list_vertices[triangle[2].index_vertex];
        	// console.log(vert1)
        	// console.log(vert2)
        	// console.log(vert3)
	        let hor = vec3.sub(vec3.create(), vert2, vert1);
	        let vert = vec3.sub(vec3.create(), vert3, vert1);

        	let tex1 = list_uvs[triangle[0].index_uv];
        	let tex2 = list_uvs[triangle[1].index_uv];
        	let tex3 = list_uvs[triangle[2].index_uv];
        	// console.log(tex1)
        	// console.log(tex2)
        	// console.log(tex3)
            let s = vec2.sub(vec2.create(), tex2, tex1);
            let t = vec2.sub(vec2.create(), tex3, tex1);

            let divisor = 1.0 / (s[0] * t[1] - s[1] * t[0]);

            let s_dir = vec3.fromValues(
                t[1] * hor[0] - t[0] * vert[0], 
                t[1] * hor[1] - t[0] * vert[1], 
                t[1] * hor[2] - t[0] * vert[2]
            );
            let t_dir = vec3.fromValues(
                s[0] * vert[0] - s[1] * hor[0], 
                s[0] * vert[1] - s[1] * hor[1], 
                s[0] * vert[2] - s[1] * hor[2]
            );

            vec3.scale(s_dir, s_dir, divisor);
            vec3.scale(t_dir, t_dir, divisor);
     //        console.log(triangle[0].index_vertex)
     //        console.log(list_tangents1[triangle[2].index_vertex])
            console.log(JSON.stringify(list_tangents1[triangle[0].index_vertex]))
            list_tangents1[triangle[0].index_vertex] = [vec3.add(vec3.create(), list_tangents1[triangle[0].index_vertex][0], s_dir), list_normals[triangle[0].index_normal]];
            list_tangents1[triangle[1].index_vertex] = [vec3.add(vec3.create(), list_tangents1[triangle[1].index_vertex][0], s_dir), list_normals[triangle[1].index_normal]];
            list_tangents1[triangle[2].index_vertex] = [vec3.add(vec3.create(), list_tangents1[triangle[2].index_vertex][0], s_dir), list_normals[triangle[2].index_normal]];
            list_tangents2[triangle[0].index_vertex] = [vec3.add(vec3.create(), list_tangents2[triangle[0].index_vertex][0], t_dir), list_normals[triangle[0].index_normal]];
            list_tangents2[triangle[1].index_vertex] = [vec3.add(vec3.create(), list_tangents2[triangle[1].index_vertex][0], t_dir), list_normals[triangle[1].index_normal]];
            list_tangents2[triangle[2].index_vertex] = [vec3.add(vec3.create(), list_tangents2[triangle[2].index_vertex][0], t_dir), list_normals[triangle[2].index_normal]];
    	});

        let list_tangents = [];
        let list_bitangents = [];
        list_tangents1.forEach(function(obj, index) {
        	let tangent = obj[0];
        	let normal = obj[1];

        	let dot = vec3.dot(normal, tangent);
        	let scaled = vec3.scale(vec3.create(), normal, dot);
        	let sub = vec3.sub(vec3.create(), tangent, scaled);
        	tangent = vec3.normalize(vec3.create(), sub);

        	if(vec3.dot(vec3.cross(vec3.create(), normal, tangent), list_tangents2[index]) < 0.0)
        	{
        		vec3.negate(vec3.create(), tangent);
        	}

            let bitangent = vec3.cross(vec3.create(), normal, tangent);
        	// console.log(tangent)
        	// console.log(bitangent)
        });




















        let list_data_vertex = [];
        let list_indices = [];

        let dict_vertices = {};

        let index = 0;
        list_triangles.forEach(function(triangle) {
            for(let i = 0; i < 3; i++) 
            {
                let vertex = triangle[i];
                let id_vertex = vertex.index_vertex+'_'+vertex.index_uv+'_'+vertex.index_normal;

                // let index_vertex_adjusted = vertex.index_vertex * 8;
                if(id_vertex in dict_vertices)
                {
                	list_indices.push(dict_vertices[id_vertex]);

                } else {
	                list_data_vertex.push(list_vertices[vertex.index_vertex][0]);
	                list_data_vertex.push(list_vertices[vertex.index_vertex][1]);
	                list_data_vertex.push(list_vertices[vertex.index_vertex][2]);

	                list_data_vertex.push(list_uvs[vertex.index_uv][0]);
	                list_data_vertex.push(list_uvs[vertex.index_uv][1]);

	                list_data_vertex.push(list_normals[vertex.index_normal][0]);
	                list_data_vertex.push(list_normals[vertex.index_normal][1]);
	                list_data_vertex.push(list_normals[vertex.index_normal][2]);

	                dict_vertices[id_vertex] = index;
                	list_indices.push(index);
                	index += 1;
                }
            }
        });
        // console.log(dict_vertices)

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