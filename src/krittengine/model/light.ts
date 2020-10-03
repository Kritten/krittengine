import { SpatialEntity } from '@/krittengine/model/spatialEntity';
import { ParamsLight } from '@/krittengine/model/light.types';

export class Light extends SpatialEntity {
  constructor(params: ParamsLight = {}) {
    super(params);
  }
}
