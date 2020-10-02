import { SpatialEntity } from '@/krittengine/model/spatialEntity';
import { ParamsRay } from '@/krittengine/model/ray.types';
import { mat4, vec3 } from 'gl-matrix';
import { DUMMY_MAT4, DUMMY_VEC3, VECTOR_UP } from '@/krittengine/controller/constants';

export class Ray extends SpatialEntity {
  direction = vec3.create();

  constructor(params: ParamsRay = {}) {
    super(params);

    if (params.direction !== undefined) {
      this.direction = params.direction;
      this.updateRotation();
    }
  }

  updateRotation(): void {
    const lookAt = mat4.targetTo(DUMMY_MAT4, this.position, vec3.scaleAndAdd(DUMMY_VEC3, this.position, this.direction, 1.0), VECTOR_UP);
    mat4.getRotation(this.rotation, lookAt);
  }

  // var angle = Math.acos(BABYLON.Vector3.Dot(v1, v2));
  // var axis = BABYLON.Vector3.Cross(v1,v2);
  // var quaternion = BABYLON.Quaternion.RotationAxis(axis, angle);
}
