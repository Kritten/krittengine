import { handle_gl, init as init_gl } from './context_gl.js';
import Renderer_Quad from './renderer_quad.js';

/**
 * This class is used to render scenes.
 * @class
 */
export default class
{
    /**
     * @param      {DOMElement}  canvas  The canvas the engine should draw into.
     */
    constructor(canvas)
    {
        init_gl(canvas);
        console.log(canvas)
        handle_gl.clearColor(0.0, 0.0, 0.0, 1.0);
        handle_gl.enable(handle_gl.DEPTH_TEST);
        handle_gl.viewport(0, 0, handle_gl.drawingBufferWidth, handle_gl.drawingBufferHeight);

        this.m_renderer_quad = new Renderer_Quad();
    }

    screen_resized(width, height)
    {
        canvas.width = width;
        canvas.height = height;
        handle_gl.viewport(0, 0, width, height);

        this.m_renderer_quad.screen_resized();  
    }

    /**
     * Renders the given scene.
     * @param      {Scene}  scene   The scene which should be rendered.
     */
    render(scene)
    {
        handle_gl.bindFramebuffer(handle_gl.FRAMEBUFFER, this.m_renderer_quad.framebuffer);
        handle_gl.clear(handle_gl.COLOR_BUFFER_BIT | handle_gl.DEPTH_BUFFER_BIT);

        if(scene.m_render_lights)
        {
            scene.lights.forEach(function(light) {
                const mesh = light.mesh;
                const material = light.material;
                handle_gl.useProgram(material.m_shader_program);

                handle_gl.uniformMatrix4fv(material.m_shader_program.uniform_matrix_view, false, scene.active_camera.matrix_view);

                handle_gl.uniformMatrix4fv(material.m_shader_program.uniform_matrix_perspective, false, scene.active_camera.matrix_perspective);

                handle_gl.uniformMatrix4fv(material.m_shader_program.uniform_matrix_model, false, light.m_matrix_transformation);

                handle_gl.bindVertexArray(mesh.m_vertex_array_object)
                handle_gl.drawElements(handle_gl.TRIANGLES, mesh.count_indices, handle_gl.UNSIGNED_SHORT, 0);  
                handle_gl.bindVertexArray(null)

                handle_gl.useProgram(null);
            })
        }

        for (let i = 0; i < scene.objects.length; i++)
        {
            let object = scene.objects[i];
            const mesh = object.mesh;
            const material = object.material;

            handle_gl.useProgram(material.m_shader_program);

            handle_gl.uniformMatrix4fv(material.m_shader_program.uniform_matrix_view, false, scene.active_camera.matrix_view);

            handle_gl.uniformMatrix4fv(material.m_shader_program.uniform_matrix_perspective, false, scene.active_camera.matrix_perspective);

            handle_gl.uniformMatrix4fv(material.m_shader_program.uniform_matrix_model, false, object.m_matrix_transformation);
            
            let matrix_normal = mat4.create();
            mat4.multiply(matrix_normal, scene.active_camera.matrix_view, object.m_matrix_transformation);
            mat4.invert(matrix_normal, matrix_normal);
            mat4.transpose(matrix_normal, matrix_normal);
            handle_gl.uniformMatrix4fv(material.m_shader_program.uniform_matrix_normal, false, matrix_normal);

            scene.lights.forEach(function(light) {
                handle_gl.uniform3f(this.m_shader_program.uniform_position_light, light.m_position[0], light.m_position[1], light.m_position[2]); 
                // console.log(light.position[1])
            }, material)
            
            
            material.upload_properties()
            // console.log(mesh.m_vertex_array_object)
            handle_gl.bindVertexArray(mesh.m_vertex_array_object)
            handle_gl.drawElements(handle_gl.TRIANGLES, mesh.count_indices, handle_gl.UNSIGNED_SHORT, 0);  
            handle_gl.bindVertexArray(null)

            handle_gl.useProgram(null);
        }

        if(scene.m_render_bounding_boxes)
        {
                const material = scene.m_tree.material;
                handle_gl.useProgram(material.m_shader_program);
                handle_gl.bindVertexArray(scene.m_tree.m_vertex_array_object)

                handle_gl.uniformMatrix4fv(material.m_shader_program.uniform_matrix_view, false, scene.active_camera.matrix_view);
                handle_gl.uniformMatrix4fv(material.m_shader_program.uniform_matrix_perspective, false, scene.active_camera.matrix_perspective);

                // const start = performance.now();
                scene.m_tree.walk(this.draw_bounding_box, {material: material, depth: scene.m_depth_bounding_box_draw});
                // scene.m_tree.walk_recursive(this.draw_bounding_box_recursive, {material: material, depth: scene.m_depth_bounding_box_draw});
                // console.log((performance.now()-start).toFixed(2)+'ms');

                handle_gl.bindVertexArray(null)
                handle_gl.useProgram(null);
        }
        
        handle_gl.bindFramebuffer(handle_gl.FRAMEBUFFER, null);
        this.m_renderer_quad.render();
    }
    // 
    // RECURSIVE
    //
    draw_bounding_box_recursive(node_aabb, func, data)
    {
        if(!node_aabb.is_leaf_node())
        {
            handle_gl.uniformMatrix4fv(data.material.m_shader_program.uniform_matrix_model, false, node_aabb.m_bounding_box_fat.m_matrix_transormation);

        } else {
            handle_gl.uniformMatrix4fv(data.material.m_shader_program.uniform_matrix_model, false, node_aabb.m_bounding_box_slim.m_matrix_transormation);
        }
        
        handle_gl.uniform1i(data.material.m_shader_program.uniform_depth, node_aabb.m_depth); 
        handle_gl.drawElements(handle_gl.LINES, 24, handle_gl.UNSIGNED_SHORT, 0);

        if(!node_aabb.is_leaf_node())
        {
            node_aabb.m_node_left.walk(func, data);
            node_aabb.m_node_right.walk(func, data);
        }
    }
    // draw_bounding_box(node_aabb, data)
    // {
    //     let result = true;
    //     // if(!node_aabb.is_leaf_node())
    //     // {
    //         if(node_aabb.m_depth == data.depth)
    //         {
    //             result = false;
    //         }

    //     //     // handle_gl.uniformMatrix4fv(data.material.m_shader_program.uniform_matrix_model, false, node_aabb.m_bounding_box_slim.m_matrix_transormation);
    //     // } else {
    //     // }
    //     handle_gl.uniform1i(data.material.m_shader_program.uniform_depth, node_aabb.m_depth); 
    //         handle_gl.uniformMatrix4fv(data.material.m_shader_program.uniform_matrix_model, false, node_aabb.m_bounding_box_fat.m_matrix_transormation);
        
    //     handle_gl.drawElements(handle_gl.LINES, 24, handle_gl.UNSIGNED_SHORT, 0);
    //         handle_gl.uniformMatrix4fv(data.material.m_shader_program.uniform_matrix_model, false, node_aabb.m_bounding_box_slim.m_matrix_transormation);
    //     handle_gl.drawElements(handle_gl.LINES, 24, handle_gl.UNSIGNED_SHORT, 0);

    //     return result;
    // }
    draw_bounding_box(node_aabb, data)
    {
        let result = true;
        handle_gl.uniform1i(data.material.m_shader_program.uniform_depth, node_aabb.m_depth); 
        if(!node_aabb.is_leaf_node())
        {
            if(node_aabb.m_depth == data.depth)
            {
                result = false;
            }

            // handle_gl.uniformMatrix4fv(data.material.m_shader_program.uniform_matrix_model, false, node_aabb.m_bounding_box_slim.m_matrix_transormation);
            handle_gl.uniformMatrix4fv(data.material.m_shader_program.uniform_matrix_model, false, node_aabb.m_bounding_box_slim.m_matrix_transormation);
            handle_gl.drawElements(handle_gl.LINES, 24, handle_gl.UNSIGNED_SHORT, 0);
            // handle_gl.uniformMatrix4fv(data.material.m_shader_program.uniform_matrix_model, false, node_aabb.m_bounding_box_fat.m_matrix_transormation);
            // handle_gl.drawElements(handle_gl.LINES, 24, handle_gl.UNSIGNED_SHORT, 0);
        } else {
            handle_gl.uniformMatrix4fv(data.material.m_shader_program.uniform_matrix_model, false, node_aabb.m_bounding_box_slim.m_matrix_transormation);
            handle_gl.drawElements(handle_gl.LINES, 24, handle_gl.UNSIGNED_SHORT, 0);
            handle_gl.uniformMatrix4fv(data.material.m_shader_program.uniform_matrix_model, false, node_aabb.m_bounding_box_fat.m_matrix_transormation);
            handle_gl.drawElements(handle_gl.LINES, 24, handle_gl.UNSIGNED_SHORT, 0);
        }
        

        return result;
    }
}