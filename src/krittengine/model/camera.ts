import { vec3, mat4 } from 'gl-matrix';
import { SpatialEntity } from '@/krittengine/model/spatialEntity';
import { ParamsCamera } from '@/krittengine/model/camera.types';

export class Camera extends SpatialEntity {
  viewingDirection: vec3 = vec3.create();

  // matrixPerspective: mat4 = mat4.create();

  matrixView: mat4 = mat4.create();

  constructor(params: ParamsCamera = {}) {
    super(params);

    this.updateViewingDirection();
  }

  updateViewingDirection() {
    this.viewingDirection = vec3.fromValues(-this.matrixView[2], -this.matrixView[6], -this.matrixView[10]);
  }
}
