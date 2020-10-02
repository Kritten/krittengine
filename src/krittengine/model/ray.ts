import { SpatialEntity } from '@/krittengine/model/spatialEntity';
import { ParamsRay } from '@/krittengine/model/ray.types';
import { vec3 } from 'gl-matrix';

export class Ray extends SpatialEntity {
  directionRayInitial = vec3.fromValues(0, 0, -1);

  constructor(params: ParamsRay = {}) {
    super(params);
  }
}
