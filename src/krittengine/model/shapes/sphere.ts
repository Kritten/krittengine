import { SpatialEntity } from '@/krittengine/model/spatialEntity';
import { ParamsSphere } from '@/krittengine/model/shapes/sphere.types';

export class Sphere extends SpatialEntity {
  radius: number = 1;

  constructor(params: ParamsSphere = {}) {
    super(params);

    if (params.radius !== undefined) {
      this.radius = params.radius;
    }
  }
}
