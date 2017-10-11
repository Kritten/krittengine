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

    get_sibling()
    {
        let node_sibling = undefined;
        
        const node_parent = this.m_node_parent;
        if(node_parent != undefined)
        {
            if(this.m_is_left_child)
            {
                node_sibling = node_parent.m_node_right;
            } else {
                node_sibling = node_parent.m_node_left;
            }
        }

        return node_sibling;
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
                let node_sibling = this.get_sibling();

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

    rebalance()
    {
        if(this.is_leaf_node())
        {
            console.error('is leaf node')
            return false;
        }

        let list_parents = this.collect_information();

        // if(this.m_tree.m_count_objects < 13)
        // {
            this.foo(list_parents);
        // } else {
        //     console.log(list_parents);
        // }
    }
    foo(list_parents)
    {
        for (var i = list_parents.length - 1; i >= 0; i--) {
            const obj_info = list_parents[i];
            if(obj_info.score >= 0.6)
            {
                console.error(obj_info);
                let node_big = undefined;
                let node_small = undefined;
                if(obj_info.is_left)
                {
                    node_big = obj_info.node.m_node_left;
                    node_small = obj_info.node.m_node_right;
                } else {
                    node_big = obj_info.node.m_node_right;
                    node_small = obj_info.node.m_node_left;
                }

                // check if whole node can be merged
                // console.log(bounds_combined);
                // console.log(obj_info.node.get_bounding_box().m_bounds);
                // let b = nodede_big.get_bounding_box().calc_volume(node_small.get_bounding_box());
                // console.log(b)

                let node_candidate_for_transfer = node_big;
                let foo = undefined;

                do
                {
                    [node_candidate_for_transfer, foo] = node_candidate_for_transfer.get_child(obj_info.axis, obj_info.smaller);
                    const bounds_combined = node_candidate_for_transfer.get_bounding_box().bounds_combined(node_small.get_bounding_box());
                    const ratio = bounds_combined[obj_info.axis] / obj_info.node.get_bounding_box().m_bounds[obj_info.axis];
                    // console.log(ratio)
                    if(ratio < 0.6)
                    {
                        this.m_tree.remove_node(node_candidate_for_transfer);
                        this.m_tree.insert_entity(node_candidate_for_transfer);
                        break;
                    }

                } while(node_candidate_for_transfer != undefined);


                // let [node_candidate_for_transfer2, bar] = node_candidate_for_transfer1.get_child(obj_info.axis, true);
                // const bounds_combined1 = node_candidate_for_transfer2.get_bounding_box().bounds_combined(node_small.get_bounding_box());
                // const ratio1 = bounds_combined1[obj_info.axis] / obj_info.node.get_bounding_box().m_bounds[obj_info.axis];
                // console.log(ratio1)




                // node_candidate_for_transfer1.update_parent(node_small); 

                // if(node_candidate_for_transfer1.m_is_left_child)
                // {
                //     node_candidate_for_transfer1.m_node_parent.m_node_left = undefined;
                // } else {
                //     node_candidate_for_transfer1.m_node_parent.m_node_right = undefined;
                // }

                // bar.update_parent(node_big);
                // node_candidate_for_transfer1.m_node_parent.m_node_left = undefined;
                // node_candidate_for_transfer1.m_node_parent.m_node_right = undefined;
            
                // node_candidate_for_transfer1.m_node_parent = undefined;

                // bar.update_bounding_boxes();


                // console.log(node_candidate_for_transfer);
                // console.log(node_big.m_node_right)

                break;
            }
        }
    }


    get_child(axis, smaller)
    {
        if(this.is_leaf_node())
        {
            return undefined;
        } else {
            let bounding_box_left = this.m_node_left.get_bounding_box();
            let bounding_box_right = this.m_node_right.get_bounding_box();

            if(smaller)
            {
                if(bounding_box_left.m_corner_min[axis] < bounding_box_right.m_corner_min[axis])
                {
                    return [this.m_node_left, this.m_node_right];
                } else {
                    return [this.m_node_right, this.m_node_left];
                }
            } else  {
                if(bounding_box_left.m_corner_max[axis] > bounding_box_right.m_corner_max[axis])
                {
                    return [this.m_node_left, this.m_node_right];
                } else {
                    return [this.m_node_right, this.m_node_left];
                }
            }
        }
    }

    get_bounding_box()
    {
        if(this.is_leaf_node())
        {
            return this.m_bounding_box_fat;
        } else {
            return this.m_bounding_box_slim;
        }
    }

    collect_information()
    {
        let list_parents = [];
        let parent = this;
        while(parent != undefined)
        {
            let obj_info = {
                node: parent, 
                score: undefined,
                is_left: undefined,
                axis: undefined,
                smaller: undefined
            };
            let bounds = parent.m_bounding_box_slim.m_bounds;
            // console.log(bounds)
            const bounding_box_left = parent.m_node_left.get_bounding_box();
            const bounding_box_right = parent.m_node_right.get_bounding_box();
            const bounds_left = bounding_box_left.m_bounds;
            const bounds_right = bounding_box_right.m_bounds;

            // get the largest axis
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
                obj_info.axis = 0;
            } else if(bounds[1] > bounds[0] && bounds[1] > bounds[2]) {
                let ratio_left = bounds_left[1] / bounds[1];
                let ratio_right = bounds_right[1] / bounds[1];
                if(ratio_left > ratio_right)
                {
                    obj_info.score = ratio_left;
                    obj_info.is_left = true;
                } else {
                    obj_info.score = ratio_right;
                    obj_info.is_left = false;
                }
                obj_info.axis = 1;
            } else {
                let ratio_left = bounds_left[2] / bounds[2];
                let ratio_right = bounds_right[2] / bounds[2];
                if(ratio_left > ratio_right)
                {
                    obj_info.score = ratio_left;
                    obj_info.is_left = true;
                } else {
                    obj_info.score = ratio_right;
                    obj_info.is_left = false;
                }
                obj_info.axis = 2;
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
        return list_parents;
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

        this.update_depth(node_parent.m_depth + 1);
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
}