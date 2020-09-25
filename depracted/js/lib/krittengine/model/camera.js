import Spatial_Entity from './spatial_entity.js'
import { handle_gl } from '../view/context_gl.js';
import { key_input, time_info, mouse_input } from '../controller/utils.js';

/**
 * Represents a renderable entity
 * @class
 */
export default class Camera extends Spatial_Entity
{
	constructor(name, data)
	{
		super(name, data);
		
	 	this.m_viewing_direction = vec3.create();
	 	this.m_matrix_perspective = mat4.create();
	 	this.m_matrix_view = mat4.create();

        mat4.perspective(this.matrix_perspective, 70, handle_gl.drawingBufferWidth / handle_gl.drawingBufferHeight, 0.1, 100.0);
	 	this.compute_viewing_direction()

		this.update_view_matrix()

		this.glob_key_input = key_input;
		this.glob_time_info = time_info;
		this.glob_mouse_input = mouse_input;
	}

	update_all()
	{
		// console.log("asdas")
		// this.init_vars()
		this.update()
		this.update_view_matrix()
	}

	update_aspect_ratio(aspect_ratio)
	{
        mat4.perspective(this.matrix_perspective, 70, aspect_ratio, 0.1, 1000.0);
	}

	get viewing_direction() { return this.m_viewing_direction; }
	set viewing_direction(viewing_direction) { return this.m_viewing_direction = viewing_direction; }

	get matrix_view() { return this.m_matrix_view; }
	set matrix_view(matrix_view) { return this.m_matrix_view = matrix_view; }

	get matrix_perspective() { return this.m_matrix_perspective; }
	set matrix_perspective(matrix_perspective) { return this.m_matrix_perspective = matrix_perspective; }

    compute_viewing_direction()
    {
        this.viewing_direction = vec3.fromValues(-this.m_matrix_view[2], -this.m_matrix_view[6], -this.m_matrix_view[10]);
    }

    update_view_matrix()
    {
        mat4.identity(this.m_matrix_view);
        mat4.translate(this.m_matrix_view, this.m_matrix_view, this.m_position);
        // console.log(this.rotation)

        let matrix_rotation = mat4.create();

        mat4.fromQuat(matrix_rotation, this.m_rotation);
        mat4.multiply(this.m_matrix_view, this.m_matrix_view, matrix_rotation)
        // mat4.rotateY(this.m_matrix_view, this.m_matrix_view, this.rotation[1]);
        // mat4.rotateX(this.m_matrix_view, this.m_matrix_view, this.rotation[0]);
        mat4.invert(this.m_matrix_view, this.m_matrix_view);
        this.viewing_direction = vec3.fromValues(-this.m_matrix_view[2], -this.m_matrix_view[6], -this.m_matrix_view[10]);
        // console.log(this.viewing_direction)

        // this.update_frustum();
    }
}