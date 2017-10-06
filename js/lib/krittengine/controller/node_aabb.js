import Bounding_Box from './bounding_box.js';

/**
 * @class
 */
export default class Node_AABB 
{
    constructor(tree, offset) 
    {
        this.m_tree = tree;
        this.m_data = undefined;
        this.m_node_parent = undefined;
        this.m_bounding_box_slim = undefined;
        this.m_bounding_box_fat = undefined;
        this.m_node_left = undefined;
        this.m_node_right = undefined;
        this.m_depth = 0;
        this.m_offset = offset;
        this.m_is_visited = false;
        this.m_is_left_child = undefined;
    }

    sort_children()
    {
        // vec3.subtract(difference, this.m_node_right.m_bounding_box.m_center, this.m_node_left.m_bounding_box.m_center);  
        let counter = 0;
        if(this.m_node_right.m_bounding_box_slim.m_center[0] < this.m_node_left.m_bounding_box_slim.m_center[0])
        {
            counter += 1;
        }
        if(this.m_node_right.m_bounding_box_slim.m_center[1] < this.m_node_left.m_bounding_box_slim.m_center[1])
        {
            counter += 1;
        }
        if(this.m_node_right.m_bounding_box_slim.m_center[2] < this.m_node_left.m_bounding_box_slim.m_center[2])
        {
            counter += 1;
        }

        if(counter > 1)
        {
            let node_tmp = this.m_node_left;
            this.m_node_left = this.m_node_right;
            this.m_node_right = node_tmp;
        }
    }
    update_bounding_box_fat()
    {
        if(this.is_leaf_node())
        {
            let corner_min = vec3.fromValues(-0.5, -0.5, -0.5);
            let corner_max = vec3.fromValues(0.5, 0.5, 0.5);
            vec3.transformMat4(corner_min, corner_min, this.m_data.m_matrix_transformation);
            vec3.transformMat4(corner_max, corner_max, this.m_data.m_matrix_transformation);
            vec3.sub(corner_min, corner_min, this.m_offset);
            vec3.add(corner_max, corner_max, this.m_offset);

            if(this.m_bounding_box_fat == undefined)
            {
                this.m_bounding_box_fat = new Bounding_Box(corner_min, corner_max); 
            } else {
                this.m_bounding_box_fat.update_size(corner_min, corner_max);
            } 
        } else {
            let corner_min = vec3.create();
            let corner_max = vec3.create();
                
            if(this.m_node_left.is_leaf_node() && this.m_node_right.is_leaf_node())
            {
                vec3.min(corner_min, this.m_node_left.m_bounding_box_fat.m_corner_min, this.m_node_right.m_bounding_box_fat.m_corner_min);
                vec3.max(corner_max, this.m_node_left.m_bounding_box_fat.m_corner_max, this.m_node_right.m_bounding_box_fat.m_corner_max);
            } 
            else if(!this.m_node_left.is_leaf_node() && !this.m_node_right.is_leaf_node())
            {
                vec3.min(corner_min, this.m_node_left.m_bounding_box_slim.m_corner_min, this.m_node_right.m_bounding_box_slim.m_corner_min);
                vec3.max(corner_max, this.m_node_left.m_bounding_box_slim.m_corner_max, this.m_node_right.m_bounding_box_slim.m_corner_max);
            } 
            else if(!this.m_node_left.is_leaf_node() && this.m_node_right.is_leaf_node())
            {
                vec3.min(corner_min, this.m_node_left.m_bounding_box_slim.m_corner_min, this.m_node_right.m_bounding_box_fat.m_corner_min);
                vec3.max(corner_max, this.m_node_left.m_bounding_box_slim.m_corner_max, this.m_node_right.m_bounding_box_fat.m_corner_max);
            } 
            else if(this.m_node_left.is_leaf_node() && !this.m_node_right.is_leaf_node())
            {
                vec3.min(corner_min, this.m_node_left.m_bounding_box_fat.m_corner_min, this.m_node_right.m_bounding_box_slim.m_corner_min);
                vec3.max(corner_max, this.m_node_left.m_bounding_box_fat.m_corner_max, this.m_node_right.m_bounding_box_slim.m_corner_max);
            }

            vec3.sub(corner_min, corner_min, this.m_offset);
            vec3.add(corner_max, corner_max, this.m_offset);
            
            if(this.m_bounding_box_fat == undefined)
            {
                this.m_bounding_box_fat = new Bounding_Box(corner_min, corner_max); 
            } else {
                this.m_bounding_box_fat.update_size(corner_min, corner_max);
            }
        }
    }

    update_depth(depth_new)
    {
        this.m_depth = depth_new;
        if(this.is_leaf_node() == false)
        {
            depth_new += 1;
            this.m_node_left.update_depth(depth_new);
            this.m_node_right.update_depth(depth_new);
        }
    }

    entity_moved()
    {
        // console.log(this.m_tree)
        // throw new Error('test');
        // console.log(this.m_data.m_name)
        let start = performance.now();
        // return
        this.update_bounding_box_slim();

        // this.m_node_parent
        if(!this.m_bounding_box_slim.is_inside_of(this.m_bounding_box_fat))
        {

        // for (var i = 0; i < 3000000; i++) {
        //     i*i*i*i*i*i*i*i*i*i*i*i*i;
        // }
            // throw new Error('bounding box not inside');
            // if node is root
            const node_parent = this.m_node_parent;
            if(node_parent == undefined)
            {
                this.update_bounding_box_fat();
            } else {
                const node_grandparent = node_parent.m_node_parent;
                let node_sibling = undefined;
                
                if(this.m_is_left_child)
                {
                    node_sibling = node_parent.m_node_right;
                } else {
                    node_sibling = node_parent.m_node_left;
                }

                node_parent.m_node_left = undefined;
                node_parent.m_node_right = undefined;

                if(node_grandparent == undefined)
                {
                    node_sibling.m_node_parent = undefined;
                    this.m_node_parent = undefined;
                    node_sibling.m_is_left_child = undefined;
                    node_sibling.update_depth(node_parent.m_depth);
                    // node_sibling.m_depth = node_parent.m_depth;
                    this.m_tree.m_node_root = node_sibling;
                    node_sibling.update_bounding_boxes()
                } else {
                    let sibling_parent = undefined;
                    if(node_parent.m_is_left_child)
                    {
                        node_sibling.m_is_left_child = true;
                        node_grandparent.m_node_left = node_sibling;

                        sibling_parent = node_grandparent.m_node_right;
                    } else {
                        node_sibling.m_is_left_child = false;
                        node_grandparent.m_node_right = node_sibling;

                        sibling_parent = node_grandparent.m_node_left;
                    }

                    node_sibling.m_node_parent = undefined;
                    this.m_node_parent = undefined;
                    node_sibling.update_depth(node_parent.m_depth);
                    // node_sibling.m_depth = node_parent.m_depth;
                    node_sibling.m_node_parent = node_grandparent;

                    node_parent.m_node_parent = undefined;
                    node_sibling.update_bounding_boxes()
                    node_sibling.update_bounding_boxes_of_parents();
                }

                // this.m_bounding_box_slim = undefined;
                // this.m_bounding_box_fat = undefined;
                this.update_bounding_boxes()
                this.m_depth = 0;
                this.m_is_left_child = undefined;

                this.m_tree.insert_entity(this);
                this.update_bounding_boxes_of_parents();

                // console.log(this.m_tree)

                 // throw new Error('test');
            }
        }
        // console.log(this.m_tree)
        let end = performance.now();
        // console.log((end - start).toFixed(4))
    }

    update_bounding_box_slim()
    {
        if(this.is_leaf_node())
        {
            let corner_min = vec3.fromValues(-0.5, -0.5, -0.5);
            let corner_max = vec3.fromValues(0.5, 0.5, 0.5);
            vec3.transformMat4(corner_min, corner_min, this.m_data.m_matrix_transformation);
            vec3.transformMat4(corner_max, corner_max, this.m_data.m_matrix_transformation);

            if(this.m_bounding_box_slim == undefined)
            {
                this.m_bounding_box_slim = new Bounding_Box(corner_min, corner_max); 
            } else {
                this.m_bounding_box_slim.update_size(corner_min, corner_max);
            }   
        } else {
            let corner_min = vec3.create();
            let corner_max = vec3.create();

            if(this.m_node_left.is_leaf_node() && this.m_node_right.is_leaf_node())
            {
                vec3.min(corner_min, this.m_node_left.m_bounding_box_fat.m_corner_min, this.m_node_right.m_bounding_box_fat.m_corner_min);
                vec3.max(corner_max, this.m_node_left.m_bounding_box_fat.m_corner_max, this.m_node_right.m_bounding_box_fat.m_corner_max);
            } 
            else if(!this.m_node_left.is_leaf_node() && !this.m_node_right.is_leaf_node())
            {
                vec3.min(corner_min, this.m_node_left.m_bounding_box_slim.m_corner_min, this.m_node_right.m_bounding_box_slim.m_corner_min);
                vec3.max(corner_max, this.m_node_left.m_bounding_box_slim.m_corner_max, this.m_node_right.m_bounding_box_slim.m_corner_max);
            } 
            else if(!this.m_node_left.is_leaf_node() && this.m_node_right.is_leaf_node())
            {
                vec3.min(corner_min, this.m_node_left.m_bounding_box_slim.m_corner_min, this.m_node_right.m_bounding_box_fat.m_corner_min);
                vec3.max(corner_max, this.m_node_left.m_bounding_box_slim.m_corner_max, this.m_node_right.m_bounding_box_fat.m_corner_max);
            } 
            else if(this.m_node_left.is_leaf_node() && !this.m_node_right.is_leaf_node())
            {
                vec3.min(corner_min, this.m_node_left.m_bounding_box_fat.m_corner_min, this.m_node_right.m_bounding_box_slim.m_corner_min);
                vec3.max(corner_max, this.m_node_left.m_bounding_box_fat.m_corner_max, this.m_node_right.m_bounding_box_slim.m_corner_max);
            }

            if(this.m_bounding_box_slim == undefined)
            {
                this.m_bounding_box_slim = new Bounding_Box(corner_min, corner_max); 
            } else {
                this.m_bounding_box_slim.update_size(corner_min, corner_max);
            }        
        }
    }

    update_bounding_boxes()
    {
        if(this.is_leaf_node())
        {
            let corner_min = vec3.fromValues(-0.5, -0.5, -0.5);
            let corner_max = vec3.fromValues(0.5, 0.5, 0.5);
            vec3.transformMat4(corner_min, corner_min, this.m_data.m_matrix_transformation);
            vec3.transformMat4(corner_max, corner_max, this.m_data.m_matrix_transformation);

            if(this.m_bounding_box_slim == undefined)
            {
                this.m_bounding_box_slim = new Bounding_Box(corner_min, corner_max); 
            } else {
                this.m_bounding_box_slim.update_size(corner_min, corner_max);
            } 

            vec3.sub(corner_min, corner_min, this.m_offset);
            vec3.add(corner_max, corner_max, this.m_offset);

            if(this.m_bounding_box_fat == undefined)
            {
                this.m_bounding_box_fat = new Bounding_Box(corner_min, corner_max); 
            } else {
                this.m_bounding_box_fat.update_size(corner_min, corner_max);
            } 
        } else {
            let corner_min = vec3.create();
            let corner_max = vec3.create();

            if(this.m_node_left.is_leaf_node() && this.m_node_right.is_leaf_node())
            {
                vec3.min(corner_min, this.m_node_left.m_bounding_box_fat.m_corner_min, this.m_node_right.m_bounding_box_fat.m_corner_min);
                vec3.max(corner_max, this.m_node_left.m_bounding_box_fat.m_corner_max, this.m_node_right.m_bounding_box_fat.m_corner_max);
            } 
            else if(!this.m_node_left.is_leaf_node() && !this.m_node_right.is_leaf_node())
            {
                vec3.min(corner_min, this.m_node_left.m_bounding_box_slim.m_corner_min, this.m_node_right.m_bounding_box_slim.m_corner_min);
                vec3.max(corner_max, this.m_node_left.m_bounding_box_slim.m_corner_max, this.m_node_right.m_bounding_box_slim.m_corner_max);
            } 
            else if(!this.m_node_left.is_leaf_node() && this.m_node_right.is_leaf_node())
            {
                vec3.min(corner_min, this.m_node_left.m_bounding_box_slim.m_corner_min, this.m_node_right.m_bounding_box_fat.m_corner_min);
                vec3.max(corner_max, this.m_node_left.m_bounding_box_slim.m_corner_max, this.m_node_right.m_bounding_box_fat.m_corner_max);
            } 
            else if(this.m_node_left.is_leaf_node() && !this.m_node_right.is_leaf_node())
            {
                vec3.min(corner_min, this.m_node_left.m_bounding_box_fat.m_corner_min, this.m_node_right.m_bounding_box_slim.m_corner_min);
                vec3.max(corner_max, this.m_node_left.m_bounding_box_fat.m_corner_max, this.m_node_right.m_bounding_box_slim.m_corner_max);
            }


            if(this.m_bounding_box_slim == undefined)
            {
                this.m_bounding_box_slim = new Bounding_Box(corner_min, corner_max); 
            } else {
                this.m_bounding_box_slim.update_size(corner_min, corner_max);
            }
                
            vec3.sub(corner_min, corner_min, this.m_offset);
            vec3.add(corner_max, corner_max, this.m_offset);
            
            if(this.m_bounding_box_fat == undefined)
            {
                this.m_bounding_box_fat = new Bounding_Box(corner_min, corner_max); 
            } else {
                this.m_bounding_box_fat.update_size(corner_min, corner_max);
            }
        }
    }

    update_bounding_boxes_of_parents()
    {
        let node_parent = this.m_node_parent;
        while(node_parent != undefined)
        {
            node_parent.update_bounding_boxes();
            node_parent = node_parent.m_node_parent;
        }
    }

    needs_update()
    {
        if(this.is_leaf_node())
        {
            console.error('is leaf node')
            return false;
        }
        // let foo = true;
        let parent = this;
        let list_parents = [];
        while(parent != undefined)
        {
        	let obj_info = {
        		node: parent, 
    			score: undefined,
    			is_left: undefined
    		};
            let bounds = parent.m_bounding_box_slim.m_bounds;
            // console.log(bounds)
            let bounds_left = undefined;
            let bounds_right = undefined;
            if(parent.m_node_left.is_leaf_node())
            {
                bounds_left = parent.m_node_left.m_bounding_box_fat.m_bounds;
            } else {
                bounds_left = parent.m_node_left.m_bounding_box_slim.m_bounds;
            }

            if(parent.m_node_right.is_leaf_node())
            {
                bounds_right = parent.m_node_right.m_bounding_box_fat.m_bounds;
            } else {
                bounds_right = parent.m_node_right.m_bounding_box_slim.m_bounds;
            }

            if(bounds[0] > bounds[1] && bounds[0] > bounds[2])
            {
            	let ratio_left = bounds_left[0] / bounds[0];
            	let ratio_right = bounds_right[0] / bounds[0];
            	if(ratio_left > ratio_right)
            	{
                	obj_info.score = ratio_left;
            		obj_info.is_left = true;
            	} else {
                	obj_info.score = ratio_right;
            		obj_info.is_left = false;
            	}
            } else if(bounds[1] > bounds[0] && bounds[1] > bounds[2]) {
                console.log('y')
            } else {
                console.log('z')
            }

            // let longest_axis = vec3.max(bounds)

            // let bounds_left = this.m_node_left.m_bounding_box_slim.m_bounds;
            // let bounds_right = this.m_node_right.m_bounding_box_slim.m_bounds;

            // let bounds_max_permitted = vec3.create(); 
            // vec3.scale(bounds_max_permitted, bounds, 0.6);
            // console.log(bounds);
            // console.log(bounds_max_permitted);
            // console.log(bounds_left);
            // console.log(bounds_right);
            // if(
            //     bounds_left[0] <= bounds_max_permitted[0] ||
            //     bounds_left[1] <= bounds_max_permitted[1] ||
            //     bounds_left[2] <= bounds_max_permitted[2])
            // {
            //     console.log('false');
            //     // foo = false;
            //     // return false;
            // } else if (
            //     bounds_right[0] <= bounds_max_permitted[0] ||
            //     bounds_right[1] <= bounds_max_permitted[1] ||
            //     bounds_right[2] <= bounds_max_permitted[2])
            // {
            //     console.log('false');
            //     // foo = false;
            //     // return false;
            // } else {
            //     console.log('true')
            // }

            list_parents.push(obj_info);

            parent = parent.m_node_parent;
        }

        // for (var i = 0; i < list_parents.length; i++) {
        //     const parent = list_parents[i];


        //     console.log(parent);
        // }
        for (var i = list_parents.length - 1; i >= 0; i--) {
            const obj_info = list_parents[i];
            if(obj_info.score >= 0.6)
            {

                console.error(obj_info);
            }
        }

        // this.print_list(list_parents);
        // if(foo)
        // {
        // console.log('true');
            
        // }
        // return true;
    }

    print_list(list_parents)
    {
        for (var i = 0; i < list_parents.length; i++) {
            let obj_parent = list_parents[i];
            console.log(obj_parent.score)
        }
    }

    update_parent(node_parent)
    {
        this.m_depth = node_parent.m_depth + 1;
        this.m_node_parent = node_parent;
    }

    is_leaf_node()
    {
        return this.m_node_left == undefined;
    }

    print_node(node_aabb)
    {
        let offset = '';
        for (var i = 0; i < node_aabb.m_depth; i++) {
            offset += '  ';
        }
        if(node_aabb.is_leaf_node())
        {
            console.log(offset+'  leaf_node on level '+node_aabb.m_depth + '; name: ' + node_aabb.m_data.m_name);
            // console.log(offset+'leaf_node on level '+this.m_depth + '; min: ' + this.m_bounding_box.m_corner_min + ', max: ' + this.m_bounding_box.m_corner_max);
        } else {
            console.log(offset+'node on level '+node_aabb.m_depth);
            // console.log(offset+'node on level '+this.m_depth + '; min: ' + this.m_bounding_box.m_corner_min + ', max: ' + this.m_bounding_box.m_corner_max)
        }

        // if(node_aabb.m_depth == 1) return false
        return true;
    }

    update_data(data)
    {
        this.m_data = data;
        data.m_node_aabb = this;
        this.update_bounding_boxes()
    }
    // 
    // RECURSIVE
    //
    walk(func, data)
    {
        func(this, func, data);
    }
}