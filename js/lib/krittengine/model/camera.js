/**
 * @private
 * @instance
 * @type {Mesh}
 * @memberOf Geometry_Entity
 */
const m_camera_viewing_direction = new WeakMap();/**
 * @private
 * @instance
 * @type {Mesh}
 * @memberOf Geometry_Entity
 */
const m_camera_matrix_view = new WeakMap();
/**
 * @private
 * @instance
 * @type {Mesh}
 * @memberOf Geometry_Entity
 */
const m_camera_matrix_perspective = new WeakMap();
/**
 * Represents a renderable entity
 * @class
 */
class Camera extends Spatial_Entity
{
	constructor(name, data)
	{
		super(name, data);
		
	 	m_camera_viewing_direction.set(this, vec3.create());
	 	m_camera_matrix_perspective.set(this, mat4.create());
	 	m_camera_matrix_view.set(this, mat4.create());
        // this.pMatrix = mat4.create();
	 	// 
        mat4.perspective(this.matrix_perspective, 45, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000.0);
	 	this.compute_viewing_direction()

		this.update_view_matrix()
	 	// console.log(this.matrix_view)
	}

	update_all()
	{
		// console.log("asdas")
		// this.init_vars()
		this.update()
		this.update_view_matrix()
	}

	get viewing_direction() { return m_camera_viewing_direction.get(this); }
	set viewing_direction(viewing_direction) { return m_camera_viewing_direction.set(this, viewing_direction); }

	get matrix_view() { return m_camera_matrix_view.get(this); }
	set matrix_view(matrix_view) { return m_camera_matrix_view.set(this, matrix_view); }

	get matrix_perspective() { return m_camera_matrix_perspective.get(this); }
	set matrix_perspective(matrix_perspective) { return m_camera_matrix_perspective.set(this, matrix_perspective); }

    compute_viewing_direction()
    {
        this.viewing_direction = vec3.fromValues(-this.matrix_view[2], -this.matrix_view[6], -this.matrix_view[10]);
    }

    update_view_matrix()
    {
        mat4.identity(this.matrix_view);
        mat4.translate(this.matrix_view, this.matrix_view, this.position);
        mat4.rotateY(this.matrix_view, this.matrix_view, this.rotation[1]);
        mat4.rotateX(this.matrix_view, this.matrix_view, this.rotation[0]);
        mat4.invert(this.matrix_view, this.matrix_view);

        // this.update_frustum();
    }
}