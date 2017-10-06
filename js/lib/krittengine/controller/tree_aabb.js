import { handle_gl } from '../view/context_gl.js';
import Node_AABB from './node_aabb.js';

/**
 * @class
 */
export default class Tree_AABB 
{
    constructor() 
    {
        this.m_node_root = undefined;
        this.m_count_objects = 0;
        this.m_depth = 0;
        // this.m_offset = vec3.create();
        // this.m_offset = vec3.fromValues(0.5, 0.5, 0.5);
        // this.m_offset = vec3.fromValues(0.06, 0.06, 0.06);
        this.m_offset = vec3.fromValues(0.1, 0.1, 0.1);
        this.m_vertex_array_object =  handle_gl.createVertexArray();

        this.create_lines();
    }

    calc_volume(node1, node2)
    {
        let bounding_box1 = undefined;
        let bounding_box2 = undefined;

        if(node1.is_leaf_node())
        {
            bounding_box1 = node1.m_bounding_box_fat;
        } else {
            bounding_box1 = node1.m_bounding_box_slim;
        }
        if(node2.is_leaf_node())
        {
            bounding_box2 = node2.m_bounding_box_fat;
        } else {
            bounding_box2 = node2.m_bounding_box_slim;
        }

        return bounding_box1.calc_volume(bounding_box2);
    }

   insert_entity(node_new)
    {
        let node_current = this.m_node_root;
        while(node_current != undefined)
        {
            if(node_current.is_leaf_node())
            {
                // console.log('leaf')

                node_current.m_node_left = node_new;
                node_current.m_node_left.m_is_left_child = true;
                node_current.m_node_left.update_parent(node_current);

                node_current.m_node_right = new Node_AABB(this, node_current.m_offset);
                node_current.m_node_right.m_is_left_child = false;
                node_current.m_node_right.update_parent(node_current);
                node_current.m_node_right.update_data(node_current.m_data);

                // node_current.sort_children();
                node_current.m_data = undefined;
                // node_current.update_bounding_box();
                break;
            } else {
                // console.log('inner')
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
                    // console.warn('ADDING NEW NODE')
                    let volume_current = node_current.m_bounding_box_slim.calc_volume();
                    let volume_left = this.calc_volume(node_new, node_current.m_node_left);
                    let volume_right = this.calc_volume(node_new, node_current.m_node_right);

                    // if new entity is far away, put current subtree in child node and add new node to other child node
                    if(volume_current < volume_left && volume_current < volume_right)
                    {
                        // create new node for subtree
                        let node_subtree = new Node_AABB(this, node_current.m_offset);

                        const depth_subtree = node_current.m_depth;
                        // console.log(depth_subtree);
                        // set the parent node
                        // set the child node to new node

                        node_subtree.m_node_left = node_current.m_node_left;
                        node_subtree.m_node_left.m_is_left_child = true;
                        node_subtree.m_node_left.update_parent(node_subtree);

                        node_subtree.m_node_right = node_current.m_node_right;
                        node_subtree.m_node_right.m_is_left_child = false;
                        node_subtree.m_node_right.update_parent(node_subtree);

                        node_subtree.update_bounding_boxes();

                        // node_current.m_right.add_node(entity);
                        // node_current.m_left = node_subtree;
                        node_current.m_node_left = node_subtree;
                        node_current.m_node_left.m_is_left_child = true;
                        node_current.m_node_left.update_parent(node_current);
                        // node_current.m_left.add_node(entity);
                        node_current.m_node_right = node_new;
                        node_current.m_node_right.m_is_left_child = false;
                        node_current.m_node_right.update_parent(node_current);

                        node_subtree.update_depth(depth_subtree + 1);
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
        let node = new Node_AABB(this, this.m_offset);
        node.update_data(entity);

        if(this.m_node_root == undefined)
        {
            this.m_node_root = node;
        } else {
            console.log('ADDING NEW NODE -------------------------------------------------------------')
            let start = performance.now();

            this.insert_entity(node);
            node.update_bounding_boxes_of_parents();
            node.m_node_parent.needs_update()
            let end = performance.now();
            // console.log((end - start).toFixed(4))

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

        handle_gl.bindVertexArray(this.m_vertex_array_object);

        let buffer_vertex_position = handle_gl.createBuffer()
        handle_gl.bindBuffer(handle_gl.ARRAY_BUFFER, buffer_vertex_position);
        handle_gl.bufferData(handle_gl.ARRAY_BUFFER, new Float32Array(list_data_vertex), handle_gl.STATIC_DRAW);
        handle_gl.vertexAttribPointer(0, 3, handle_gl.FLOAT, false, 12, 0);
        handle_gl.enableVertexAttribArray(0);  
        
        let ebo = handle_gl.createBuffer();
        handle_gl.bindBuffer(handle_gl.ELEMENT_ARRAY_BUFFER, ebo);
        handle_gl.bufferData(handle_gl.ELEMENT_ARRAY_BUFFER,  new Uint16Array(list_indices), handle_gl.STATIC_DRAW);
        
        handle_gl.bindVertexArray(null);
        handle_gl.bindBuffer(handle_gl.ELEMENT_ARRAY_BUFFER, null);
    }
}