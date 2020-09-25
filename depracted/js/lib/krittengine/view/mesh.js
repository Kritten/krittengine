import Bounding_Box from '../controller/bounding_box.js';
import { handle_gl } from './context_gl.js';
import { load_text } from '../controller/utils.js';

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
export default class Mesh
{
	constructor(callback, name, path)
	{
		this.m_name = name
		this.m_path = path
        this.m_is_loaded = false
        this.callback = callback
        this.m_vertex_array_object = undefined;
        
        load_text(path).then(
            function(string_mesh)
            {
            	let start_parsing = performance.now();
            	let {bounding_box, data_vertex} = this.parse_obj(string_mesh);
            	let {list_indices, list_data_vertex} = data_vertex;
            	console.log('Parsing took ' + (performance.now() - start_parsing).toFixed(2)+'ms')

            	this.m_vertex_array_object =  handle_gl.createVertexArray();
				handle_gl.bindVertexArray(this.m_vertex_array_object);

				this.count_indices = list_indices.length

				let buffer_vertex_position = handle_gl.createBuffer()
				handle_gl.bindBuffer(handle_gl.ARRAY_BUFFER, buffer_vertex_position);
			    handle_gl.bufferData(handle_gl.ARRAY_BUFFER, new Float32Array(list_data_vertex), handle_gl.STATIC_DRAW);
				handle_gl.vertexAttribPointer(0, 3, handle_gl.FLOAT, false, 56, 0);
			    handle_gl.enableVertexAttribArray(0);  
				handle_gl.vertexAttribPointer(1, 2, handle_gl.FLOAT, false, 56, 12);
			    handle_gl.enableVertexAttribArray(1);  
				handle_gl.vertexAttribPointer(2, 3, handle_gl.FLOAT, false, 56, 20);
			    handle_gl.enableVertexAttribArray(2); 
				handle_gl.vertexAttribPointer(3, 3, handle_gl.FLOAT, false, 56, 32);
			    handle_gl.enableVertexAttribArray(3); 
				handle_gl.vertexAttribPointer(4, 3, handle_gl.FLOAT, false, 56, 44);
			    handle_gl.enableVertexAttribArray(4);  
				
				let ebo = handle_gl.createBuffer();
			    handle_gl.bindBuffer(handle_gl.ELEMENT_ARRAY_BUFFER, ebo);
			    handle_gl.bufferData(handle_gl.ELEMENT_ARRAY_BUFFER,  new Uint16Array(list_indices), handle_gl.STATIC_DRAW);
			    
				handle_gl.bindVertexArray(null);
			    handle_gl.bindBuffer(handle_gl.ELEMENT_ARRAY_BUFFER, null);

                this.finished_loading() 
            }.bind(this)
        )
	}

    // 

	parse_obj(string_mesh)
	{
		let list_vertices = [];
		let list_normals = [];
		let list_uvs = [];

		let corner_min = vec3.fromValues(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
		let corner_max = vec3.fromValues(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);

        let list_triangles = [];

    	let lines = string_mesh.split('\n');
    	for(let i = 0; i < lines.length; i++) 
    	{
    		let line = lines[i]
    		let values = line.split(' ');

    		if(values[0] == 'v')
    		{
    			let vertex = vec3.fromValues(values[1], values[2], values[3]);
    			vec3.min(corner_min, corner_min, vertex);
    			vec3.max(corner_max, corner_max, vertex);
    			list_vertices.push(vertex);
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
                    	'id': index_vertex + '_' + index_uv + '_' + index_normal,
                        'index_vertex': index_vertex,
                        'index_uv': index_uv,
                        'index_normal': index_normal
                    });
    			}

                list_triangles.push(triangle);
    		}
    	}
		// console.log('parsing: '+this.m_name)

		// console.log(string_mesh)
		// console.log('#############################')
		console.log(this.m_name)
		let bounding_box = new Bounding_Box(corner_min, corner_max);
		// console.log(bounding_box.m_center)
		// console.log(bounding_box.m_bounds)
		// console.log(bounding_box.m_bounds[0] - 1.0)
		// console.log(bounding_box.m_bounds[1] - 1.0)
		// console.log(bounding_box.m_bounds[2] - 1.0)
		// console.log(vec3.equals(bounding_box.m_center, vec3.fromValues(0.0, 0.0, 0.0)))

		if(
			(bounding_box.m_bounds[0] - 1.0 > 0.001 || 
			bounding_box.m_bounds[1] - 1.0 > 0.001 || 
			bounding_box.m_bounds[2] - 1.0 > 0.001) ||
			!vec3.equals(bounding_box.m_center, vec3.fromValues(0.0, 0.0, 0.0))
		)
		{
			this.normalize_mesh(list_vertices, bounding_box);
		}
		// console.log('#############################')

        return {
        	bounding_box: bounding_box,
        	data_vertex: this.create_data_vertex(list_triangles, list_vertices, list_uvs, list_normals)
        };
	}

	normalize_mesh(list_vertices, bounding_box)
	{
		console.warn('NORMALIZING MESH '+this.m_name)
		let bound_max = Math.max(bounding_box.m_bounds[0], bounding_box.m_bounds[1], bounding_box.m_bounds[2]);
		let bound_max_inv = 1.0 / bound_max;

		for(let i = 0; i < list_vertices.length; i++) 
    	{
    		vec3.sub(list_vertices[i], list_vertices[i], bounding_box.m_center);
    		vec3.scale(list_vertices[i], list_vertices[i], bound_max_inv);
    	}
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
        let dir_tangents1 = {};
        let dir_tangents2 = {};
        list_triangles.forEach(function(triangle) { 
        	dir_tangents1[triangle[0].id] = [vec3.create(), vec3.create()]; 
        	dir_tangents1[triangle[1].id] = [vec3.create(), vec3.create()]; 
        	dir_tangents1[triangle[2].id] = [vec3.create(), vec3.create()]; 
        	dir_tangents2[triangle[0].id] = [vec3.create(), vec3.create()]; 
        	dir_tangents2[triangle[1].id] = [vec3.create(), vec3.create()]; 
        	dir_tangents2[triangle[2].id] = [vec3.create(), vec3.create()]; 
        });
        // for (let i = 0; i < list_vertices.length; i++) { dir_tangents1.push([vec3.create(), vec3.create()]); }
        // list_triangles.forEach(function(triangle) { dir_tangents2[triangle.id] = vec3.create() });
    	// for (let i = 0; i < list_vertices.length; i++) { dir_tangents2.push([vec3.create(), vec3.create()]); }

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
            // vec3.normalize(s_dir, s_dir);
            // console.log(s_dir)
            // console.log(dir_tangents1[triangle[0].id])
            // console.log(triangle[0].index_vertex)
     //        console.log(dir_tangents1[triangle[2].index_vertex])
            // console.log(JSON.stringify(dir_tangents1[triangle[0].index_vertex]))
            // console.log(dir_tangents1[triangle[0].id])
            dir_tangents1[triangle[0].id] = [vec3.add(vec3.create(), dir_tangents1[triangle[0].id][0], s_dir), list_normals[triangle[0].index_normal]];
            dir_tangents1[triangle[1].id] = [vec3.add(vec3.create(), dir_tangents1[triangle[1].id][0], s_dir), list_normals[triangle[1].index_normal]];
            dir_tangents1[triangle[2].id] = [vec3.add(vec3.create(), dir_tangents1[triangle[2].id][0], s_dir), list_normals[triangle[2].index_normal]];
            dir_tangents2[triangle[0].id] = [vec3.add(vec3.create(), dir_tangents2[triangle[0].id][0], t_dir), list_normals[triangle[0].index_normal]];
            dir_tangents2[triangle[1].id] = [vec3.add(vec3.create(), dir_tangents2[triangle[1].id][0], t_dir), list_normals[triangle[1].index_normal]];
            dir_tangents2[triangle[2].id] = [vec3.add(vec3.create(), dir_tangents2[triangle[2].id][0], t_dir), list_normals[triangle[2].index_normal]];
    	});

        	// console.log(dir_tangents1)


        let dir_tangents = {};
        let dir_bitangents = {};
        for (let key in dir_tangents1) {
		    let [tangent, normal] = dir_tangents1[key];
        	// dir_tangents1.forEach(function(obj, index) {

        	let dot = vec3.dot(normal, tangent);
        	let scaled = vec3.scale(vec3.create(), normal, dot);
        	let sub = vec3.sub(vec3.create(), tangent, scaled);
        	tangent = vec3.normalize(vec3.create(), sub);

        	if(vec3.dot(vec3.cross(vec3.create(), normal, tangent), dir_tangents2[key]) < 0.0)
        	{
        		vec3.negate(vec3.create(), tangent);
        	}

            let bitangent = vec3.cross(vec3.create(), normal, tangent);
        	// console.log(tangent)
        	dir_tangents[key] = tangent;
        	dir_bitangents[key] = bitangent;
        	// console.log(bitangent)
        }




















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

	                list_data_vertex.push(dir_tangents[id_vertex][0]);
	                list_data_vertex.push(dir_tangents[id_vertex][1]);
	                list_data_vertex.push(dir_tangents[id_vertex][2]);

	                list_data_vertex.push(dir_bitangents[id_vertex][0]);
	                list_data_vertex.push(dir_bitangents[id_vertex][1]);
	                list_data_vertex.push(dir_bitangents[id_vertex][2]);

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