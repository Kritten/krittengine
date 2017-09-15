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

   insert_entity(node_new)
    {
        let node_current = this.m_node_root;
        while(node_current != undefined)
        {
            if(node_current.is_leaf_node())
            {
                console.log('leaf')

                node_current.m_node_left = node_new;
                node_current.m_node_left.update_parent(node_current);

                node_current.m_node_right = new Node_AABB(node_current.m_offset);
                node_current.m_node_right.update_parent(node_current);
                node_current.m_node_right.update_data(node_current.m_data);

                node_current.sort_children();
                node_current.m_data = undefined;
                // node_current.update_bounding_box();
                break;
            } else {
                console.log('inner')
                if(node_new.m_bounding_box_slim.is_inside_of(node_current.m_node_left.m_bounding_box_slim))
                {
                    node_current = node_current.m_node_left;
                    continue;
                } 
                else if(node_new.m_bounding_box_slim.is_inside_of(node_current.m_node_right.m_bounding_box_slim))
                {
                    node_current = node_current.m_node_right;
                    continue;
                } else {
                    console.warn('ADDING NEW NODE')
                    let volume_current = node_current.m_bounding_box_slim.calc_volume();
                    let volume_left = node_new.m_bounding_box_slim.calc_volume(node_current.m_node_left.m_bounding_box_slim);
                    let volume_right = node_new.m_bounding_box_slim.calc_volume(node_current.m_node_right.m_bounding_box_slim);

                    // if new entity is far away, put current subtree in child node and add new node to other child node
                    if(volume_current < volume_left && volume_current < volume_right)
                    {
                        // create new node for subtree
                        let node_subtree = new Node_AABB(node_current.m_offset);
                        node_subtree.m_depth = node_current.m_depth + 1;
                        // set the parent node
                        // set the child node to new node

                        node_subtree.m_node_left = node_current.m_node_left;
                        node_current.m_node_left.update_parent(node_subtree);

                        node_subtree.m_node_right = node_current.m_node_right;
                        node_current.m_node_right.update_parent(node_subtree);

                        node_subtree.update_bounding_box();

                        // node_current.m_right.add_node(entity);
                        // node_current.m_left = node_subtree;
                        node_current.m_node_left = node_subtree;
                        node_subtree.update_parent(node_current);
                        // node_current.m_left.add_node(entity);
                        node_current.m_node_right = node_new;
                        node_new.update_parent(node_current);

                        // console.log(node_current.needs_update());
                        // console.log(node_current)

                        // node_current.update_aabb();
                        // node_current.update_bounding_box();
                        break;
                    } else {
                        if(volume_left < volume_right)
                        {
                            node_current = node_current.m_node_left;
                        } else {
                            node_current = node_current.m_node_right;
                        }
                        continue;
                    }
                }
                // node_current.update_bounding_box();
            }
        }
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
            this.insert_entity(node);
            node.update_bounding_boxes_of_parents();
            // this.m_node_root.add_node(node);
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
    // 
    // RECURSIVE
    // 
    walk_recursive(func, data)
    {
        if(this.m_node_root != undefined)
        {
            this.m_node_root.walk(func, data);
        }
    }
    walk(func, data = {})
    {
        if(this.m_node_root != undefined)
        {
            let node_current = this.m_node_root;
            while(node_current != undefined)
            {
                if(node_current.m_is_visited == false)
                {
                    
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
            this.walk(this.m_node_root.print_node);
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