/**
 * @private
 * @instance
 * @type {Object}
 * @memberOf Krittengine
 */
const m_viewport = new WeakMap();
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
        gl.viewportWidth = m_viewport.get(this).width;
        gl.viewportHeight = m_viewport.get(this).height;

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        /////////////////////////////////
        
        // this.pMatrix = mat4.create();    

        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


        
        this.quad_frame_buffer = undefined
        this.quad_texture = undefined
        this.renderbuffer = undefined
        this.create_framebuffer()
        this.m_quad_renderer = new Renderer_Quad(m_viewport.get(this), this.quad_texture);

        // mat4.perspective(this.pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0);
    }

    create_framebuffer()
    {

        // create framebuffer
        this.quad_frame_buffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.quad_frame_buffer);
        // set frame dimensions
        this.quad_frame_buffer.width = m_viewport.get(this).width;
        this.quad_frame_buffer.height = m_viewport.get(this).height;
        // init the framebuffer-texture
        this.quad_texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.quad_texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); 
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.quad_frame_buffer.width, this.quad_frame_buffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        // init depthbuffer
        this.renderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.quad_frame_buffer.width, this.quad_frame_buffer.height);
        // 
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.quad_texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer);

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    /**
     * Renders the given scene.
     * @param      {Scene}  scene   The scene which should be rendered.
     */
    render(scene)
    {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.quad_frame_buffer);
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
                gl.uniform4f(this.m_shader_program.uniform_position_light, light.position[0], light.position[1], light.position[2], 0.0); 
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
        this.m_quad_renderer.render();
    }

    getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }
}