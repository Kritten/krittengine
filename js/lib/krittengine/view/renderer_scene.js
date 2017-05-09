/**
 * @private
 * @instance
 * @type {Object}
 * @memberOf Krittengine
 */
const m_viewport = new WeakMap();/**
 * @private
 * @instance
 * @type {Object}
 * @memberOf Krittengine
 */
const m_renderer_quad = new WeakMap();
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
        m_viewport.set(this, {width: canvas.clientWidth, height: canvas.clientHeight, ratio_wh: canvas.clientWidth/canvas.clientHeight, ratio_hw: canvas.clientHeight/canvas.clientWidth})

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

        m_renderer_quad.set(this, new Renderer_Quad(m_viewport.get(this)));
    }

    screen_resized(width, height)
    {
        console.log(width, height)
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);

        m_renderer_quad.get(this).screen_resized();  
    }

    /**
     * Renders the given scene.
     * @param      {Scene}  scene   The scene which should be rendered.
     */
    render(scene)
    {
        gl.bindFramebuffer(gl.FRAMEBUFFER, m_renderer_quad.get(this).framebuffer);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if(scene.render_lights)
        {
            scene.lights.forEach(function(light) {
                const mesh = light.mesh;
                const material = light.material;
                gl.useProgram(material.m_shader_program);

                gl.uniformMatrix4fv(material.m_shader_program.uniform_matrix_view, false, scene.active_camera.matrix_view);

                gl.uniformMatrix4fv(material.m_shader_program.uniform_matrix_perspective, false, scene.active_camera.matrix_perspective);

                let matrix_model = mat4.create();
                mat4.translate(matrix_model, matrix_model, light.position);
                mat4.rotateX(matrix_model, matrix_model, light.rotation[0]);
                mat4.rotateY(matrix_model, matrix_model, light.rotation[1]);
                mat4.rotateZ(matrix_model, matrix_model, light.rotation[2]);
                mat4.scale(matrix_model, matrix_model, light.scale);
                gl.uniformMatrix4fv(material.m_shader_program.uniform_matrix_model, false, matrix_model);

                
                
                gl.bindVertexArray(mesh.m_vertex_array_object)
                gl.drawElements(gl.TRIANGLES, mesh.count_indices, gl.UNSIGNED_SHORT, 0);  
                gl.bindVertexArray(null)

                gl.useProgram(null);
            })
        }

        for (var i = 0; i < scene.objects.length; i++)
        // for(const object of scene.objects)
        {
            let object = scene.objects[i];
            const mesh = object.mesh;
            const material = object.material;

            gl.useProgram(material.m_shader_program);

            gl.uniformMatrix4fv(material.m_shader_program.uniform_matrix_view, false, scene.active_camera.matrix_view);

            gl.uniformMatrix4fv(material.m_shader_program.uniform_matrix_perspective, false, scene.active_camera.matrix_perspective);

            let matrix_model = mat4.create();
            mat4.translate(matrix_model, matrix_model, object.position);
            mat4.rotateX(matrix_model, matrix_model, object.rotation[0]);
            mat4.rotateY(matrix_model, matrix_model, object.rotation[1]);
            mat4.rotateZ(matrix_model, matrix_model, object.rotation[2])
            mat4.scale(matrix_model, matrix_model, object.scale);
            gl.uniformMatrix4fv(material.m_shader_program.uniform_matrix_model, false, matrix_model);
            

            let matrix_normal = mat4.create();
            mat4.multiply(matrix_normal, scene.active_camera.matrix_view, matrix_model);
            mat4.invert(matrix_normal, matrix_normal);
            mat4.transpose(matrix_normal, matrix_normal);
            gl.uniformMatrix4fv(material.m_shader_program.uniform_matrix_normal, false, matrix_normal);

            scene.lights.forEach(function(light) {
                gl.uniform3f(this.m_shader_program.uniform_position_light, light.position[0], light.position[1], light.position[2]); 
                // console.log(light.position[1])
            }, material)
            
            
            material.upload_properties()
            // console.log(mesh.m_vertex_array_object)
            gl.bindVertexArray(mesh.m_vertex_array_object)
            gl.drawElements(gl.TRIANGLES, mesh.count_indices, gl.UNSIGNED_SHORT, 0);  
            gl.bindVertexArray(null)

            gl.useProgram(null);
        }
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        m_renderer_quad.get(this).render();
    }
}