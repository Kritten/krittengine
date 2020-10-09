import { SpatialEntity } from '@/krittengine/model/spatialEntity';
import { ParamsRay } from '@/krittengine/model/ray.types';
import { mat4, vec3 } from 'gl-matrix';
import { DUMMY_MAT4, DUMMY_VEC3, VECTOR_UP } from '@/krittengine/controller/constants';
import { transformDirectionWithMat4 } from '@/krittengine/controller/helpers';

export class Ray extends SpatialEntity {
  direction = vec3.create();

  constructor(params: ParamsRay) {
    super(params);

    this.direction = params.direction;

    this.updateRotation();
  }

  updateRotation(): void {
    const lookAt = mat4.targetTo(DUMMY_MAT4, this.position, vec3.scaleAndAdd(DUMMY_VEC3, this.position, this.direction, 1.0), VECTOR_UP);
    mat4.getRotation(this.rotation, lookAt);
    this.updateMatrixTransformation();
  }

  transform(matrix: mat4): Ray {
    return new Ray({
      position: vec3.transformMat4(vec3.create(), this.position, matrix),
      direction: transformDirectionWithMat4(this.direction, matrix),
    });
  }

  // static createFromTarget(position: vec3, target: vec3) {
  //   return new Ray({});
  // }

  // var angle = Math.acos(BABYLON.Vector3.Dot(v1, v2));
  // var axis = BABYLON.Vector3.Cross(v1,v2);
  // var quaternion = BABYLON.Quaternion.RotationAxis(axis, angle);
}
