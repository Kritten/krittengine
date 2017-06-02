/**
 * This class is used to render scenes.
 * @class
 */
class Renderer_Scene
{
    /**
     * @param      {DOMElement}  canvas  The canvas the engine should draw into.
     */
    constructor(canvas)
    {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

        this.m_renderer_quad = new Renderer_Quad();
    }

    screen_resized(width, height)
    {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);

        this.m_renderer_quad.screen_resized();  
    }

    /**
     * Renders the given scene.
     * @param      {Scene}  scene   The scene which should be rendered.
     */
    render(scene)
    {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.m_renderer_quad.framebuffer);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if(scene.m_render_lights)
        {
            scene.lights.forEach(function(light) {
                const mesh = light.mesh;
                const material = light.material;
                gl.useProgram(material.m_shader_program);

                gl.uniformMatrix4fv(material.m_shader_program.uniform_matrix_view, false, scene.active_camera.matrix_view);

                gl.uniformMatrix4fv(material.m_shader_program.uniform_matrix_perspective, false, scene.active_camera.matrix_perspective);

                gl.uniformMatrix4fv(material.m_shader_program.uniform_matrix_model, false, light.m_matrix_transformation);

                gl.bindVertexArray(mesh.m_vertex_array_object)
                gl.drawElements(gl.TRIANGLES, mesh.count_indices, gl.UNSIGNED_SHORT, 0);  
                gl.bindVertexArray(null)

                gl.useProgram(null);
            })
        }

        for (let i = 0; i < scene.objects.length; i++)
        {
            let object = scene.objects[i];
            const mesh = object.mesh;
            const material = object.material;

            gl.useProgram(material.m_shader_program);

            gl.uniformMatrix4fv(material.m_shader_program.uniform_matrix_view, false, scene.active_camera.matrix_view);

            gl.uniformMatrix4fv(material.m_shader_program.uniform_matrix_perspective, false, scene.active_camera.matrix_perspective);

            gl.uniformMatrix4fv(material.m_shader_program.uniform_matrix_model, false, object.m_matrix_transformation);
            
            let matrix_normal = mat4.create();
            mat4.multiply(matrix_normal, scene.active_camera.matrix_view, object.m_matrix_transformation);
            mat4.invert(matrix_normal, matrix_normal);
            mat4.transpose(matrix_normal, matrix_normal);
            gl.uniformMatrix4fv(material.m_shader_program.uniform_matrix_normal, false, matrix_normal);

            scene.lights.forEach(function(light) {
                gl.uniform3f(this.m_shader_program.uniform_position_light, light.m_position[0], light.m_position[1], light.m_position[2]); 
                // console.log(light.position[1])
            }, material)
            
            
            material.upload_properties()
            // console.log(mesh.m_vertex_array_object)
            gl.bindVertexArray(mesh.m_vertex_array_object)
            gl.drawElements(gl.TRIANGLES, mesh.count_indices, gl.UNSIGNED_SHORT, 0);  
            gl.bindVertexArray(null)

            gl.useProgram(null);
        }

        if(scene.m_render_bounding_boxes)
        {
                const material = scene.m_tree.material;
                gl.useProgram(material.m_shader_program);
                gl.bindVertexArray(scene.m_tree.m_vertex_array_object)

                gl.uniformMatrix4fv(material.m_shader_program.uniform_matrix_view, false, scene.active_camera.matrix_view);
                gl.uniformMatrix4fv(material.m_shader_program.uniform_matrix_perspective, false, scene.active_camera.matrix_perspective);

                scene.m_tree.walk(this.draw_bounding_box, material);
  
                gl.bindVertexArray(null)
                gl.useProgram(null);
        }
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this.m_renderer_quad.render();
    }

    draw_bounding_box(node_aabb, func, data)
    {
        if(!node_aabb.is_leaf_node())
        {
            node_aabb.m_node_left.walk(func, data);
            node_aabb.m_node_right.walk(func, data);
        }
        
        gl.uniformMatrix4fv(data.m_shader_program.uniform_matrix_model, false, node_aabb.m_bounding_box.m_matrix_transormation);
        gl.uniform1i(data.m_shader_program.uniform_depth, node_aabb.m_depth); 
        gl.drawElements(gl.LINES, 24, gl.UNSIGNED_SHORT, 0);
    }
}