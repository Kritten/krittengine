import { vec3, mat4, glMatrix } from 'gl-matrix';
import { SpatialEntity } from '@/krittengine/model/spatialEntity';
import { ParamsCamera } from '@/krittengine/model/camera.types';
import { TimeService } from '@/krittengine/controller/time.service';
import { InputService } from '@/krittengine/controller/input.service';
import { CanvasService } from '@/krittengine/controller/canvas.service';

export class Camera extends SpatialEntity {
  viewingDirection: vec3 = vec3.create();

  // view -> screen
  matrixPerspective: mat4 = mat4.create();

  // screen -> view
  matrixPerspectiveInverse: mat4 = mat4.create();

  // world -> view
  matrixView: mat4 = mat4.create();

  // view -> world
  matrixViewInverse: mat4 = mat4.create();

  constructor(params: ParamsCamera = {}) {
    super(params);

    this.init();
  }

  update(): void {
    this.hookUpdate({ TimeService, InputService });
  }

  updateMatrixTransformation(): void {
    super.updateMatrixTransformation();
    this.recalculateMatrixView();
  }

  updateAspectRatio(): void {
    const aspectRatio = CanvasService.canvas.width / CanvasService.canvas.height;
    mat4.perspective(this.matrixPerspective, glMatrix.toRadian(70), aspectRatio, 0.1, 1000.0);
    mat4.invert(this.matrixPerspectiveInverse, this.matrixPerspective);
  }

  recalculateMatrixView(): void {
    mat4.fromRotationTranslation(this.matrixViewInverse, this.rotation, this.position);
    mat4.invert(this.matrixView, this.matrixViewInverse);

    this.updateViewingDirection();
  }

  updateViewingDirection(): void {
    this.viewingDirection = vec3.fromValues(-this.matrixView[2], -this.matrixView[6], -this.matrixView[10]);
  }
}

// // let quat_x = quat.setAxisAngle(quat.create(), vec3.fromValues(1.0, 0.0, 0.0), glMatrix.toRadian(360));
// // let quatX = quat.create();
// // let quatY = quat.create();
// const quatY = quat.setAxisAngle(quat.create(), vec3.fromValues(0.0, 1.0, 0.0), glMatrix.toRadian(0));
// // let quatY = quat.setAxisAngle(quat.create(), vec3.fromValues(1.0, 0.0, 0.0), glMatrix.toRadian(-TimeService.timeDeltaInSeconds));
// // quat.multiply(quatX, quatY, quatX);
// // quat.normalize(quatX, quatX);
// quat.multiply(camera.rotation, camera.rotation, quatY);
// // quat.normalize(camera.rotation, camera.rotation);
// // console.log(camera.rotation, 'camera.rotation');
// /**
//  * Update transformation matrix
//  */
// camera.updateMatrixTransformation();
