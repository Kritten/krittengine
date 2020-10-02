import { vec3, mat4, glMatrix } from 'gl-matrix';
import { SpatialEntity } from '@/krittengine/model/spatialEntity';
import { ParamsCamera } from '@/krittengine/model/camera.types';

export class Camera extends SpatialEntity {
  viewingDirection: vec3 = vec3.create();

  matrixPerspective: mat4 = mat4.create();

  matrixView: mat4 = mat4.create();

  constructor(params: ParamsCamera = {}) {
    super(params);

    this.init();
  }

  updateMatrixTransformation(): void {
    super.updateMatrixTransformation();
    this.recalculateMatrixView();
  }

  updateAspectRatio(aspectRatio: number): void {
    mat4.perspective(this.matrixPerspective, glMatrix.toRadian(70), aspectRatio, 0.1, 1000.0);
  }

  recalculateMatrixView(): void {
    mat4.fromRotationTranslation(this.matrixView, this.rotation, this.position);
    mat4.invert(this.matrixView, this.matrixView);

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
