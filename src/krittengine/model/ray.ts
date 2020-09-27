import { SpatialEntity } from '@/krittengine/model/spatialEntity';
import { ParamsRay } from '@/krittengine/model/ray.types';

export class Ray extends SpatialEntity {
  constructor(params: ParamsRay = {}) {
    super(params);
  }
}
