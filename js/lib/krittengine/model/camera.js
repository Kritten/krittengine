/**
 * Represents a renderable entity
 * @class
 */
class Camera extends Spatial_Entity
{
	constructor(name, data)
	{
		super(name, data);
		
	 	this.m_viewing_direction = vec3.create();
	 	this.m_matrix_perspective = mat4.create();
	 	this.m_matrix_view = mat4.create();

        mat4.perspective(this.matrix_perspective, 70, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000.0);
	 	this.compute_viewing_direction()

		this.update_view_matrix()
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
        this.viewing_direction = vec3.fromValues(-this.matrix_view[2], -this.matrix_view[6], -this.matrix_view[10]);
    }

    update_view_matrix()
    {
        mat4.identity(this.matrix_view);
        mat4.translate(this.matrix_view, this.matrix_view, this.position);
        // console.log(this.rotation)

        let matrix_rotation = mat4.create();
        mat4.fromQuat(matrix_rotation, this.rotation);
        mat4.multiply(this.matrix_view, this.matrix_view, matrix_rotation)
        // mat4.rotateY(this.matrix_view, this.matrix_view, this.rotation[1]);
        // mat4.rotateX(this.matrix_view, this.matrix_view, this.rotation[0]);
        mat4.invert(this.matrix_view, this.matrix_view);
        this.viewing_direction = vec3.fromValues(-this.matrix_view[2], -this.matrix_view[6], -this.matrix_view[10]);
        // console.log(this.viewing_direction)

        // this.update_frustum();
    }
}