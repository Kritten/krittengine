import { mat4, quat, vec3 } from 'gl-matrix';
import { Entity } from '@/krittengine/model/entity';
import { ParamsSpatialEntity } from '@/krittengine/model/spatialEntity.types';

export abstract class SpatialEntity extends Entity {
  position: vec3 = vec3.create();

  rotation: quat = quat.create();

  scale: vec3 = vec3.fromValues(1.0, 1.0, 1.0);

  matrixTransformation: mat4 = mat4.create();

  protected constructor(params: ParamsSpatialEntity = {}) {
    super(params);

    if (params.position !== undefined) {
      this.position = params.position;
    }

    if (params.rotation !== undefined) {
      this.rotation = params.rotation;
    }

    if (params.scale !== undefined) {
      this.scale = params.scale;
    }

    this.updateMatrixTransformation();
  }

  updateMatrixTransformation() {
    mat4.fromRotationTranslationScale(this.matrixTransformation, this.rotation, this.position, this.scale);
  }
}
