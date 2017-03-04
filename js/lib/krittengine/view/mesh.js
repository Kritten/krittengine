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
            function(mesh)
            {
            	// console.log(mesh)
            	this.m_vertex_array_object =  gl.createVertexArray();
				gl.bindVertexArray(this.m_vertex_array_object);

				this.count_indices = mesh.indices.length

				this.m_buffer_vertex_position = gl.createBuffer()
				gl.bindBuffer(gl.ARRAY_BUFFER, this.m_buffer_vertex_position);
			    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);
			    gl.enableVertexAttribArray(0);  
				gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
				gl.bindBuffer(gl.ARRAY_BUFFER, null);

		    	this.m_buffer_vertex_texture_coords = gl.createBuffer()
		        gl.bindBuffer(gl.ARRAY_BUFFER, this.m_buffer_vertex_texture_coords);
		        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.texture_coords), gl.STATIC_DRAW);
			    gl.enableVertexAttribArray(1);  
				gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
				gl.bindBuffer(gl.ARRAY_BUFFER, null);

		    	this.m_buffer_vertex_normal = gl.createBuffer()
		        gl.bindBuffer(gl.ARRAY_BUFFER, this.m_buffer_vertex_normal);
		        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.normals), gl.STATIC_DRAW);
			    gl.enableVertexAttribArray(2);  
				gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);
				gl.bindBuffer(gl.ARRAY_BUFFER, null);

		    	this.m_buffer_vertex_tangent = gl.createBuffer()
		        gl.bindBuffer(gl.ARRAY_BUFFER, this.m_buffer_vertex_tangent);
		        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.tangents), gl.STATIC_DRAW);
			    gl.enableVertexAttribArray(3);  
				gl.vertexAttribPointer(3, 3, gl.FLOAT, false, 0, 0);
				gl.bindBuffer(gl.ARRAY_BUFFER, null);

		    	this.m_buffer_vertex_bitangent = gl.createBuffer()
		        gl.bindBuffer(gl.ARRAY_BUFFER, this.m_buffer_vertex_bitangent);
		        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.bitangents), gl.STATIC_DRAW);
			    gl.enableVertexAttribArray(4);  
				gl.vertexAttribPointer(4, 3, gl.FLOAT, false, 0, 0);
				gl.bindBuffer(gl.ARRAY_BUFFER, null);
				
				this.EBO = gl.createBuffer();
			    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.EBO);
			    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,  new Uint16Array(mesh.indices), gl.STATIC_DRAW);
			    
				gl.bindVertexArray(null);
			    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

                this.finished_loading() 
            }.bind(this)
        )
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