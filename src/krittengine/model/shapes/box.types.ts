import { ParamsSpatialEntity } from '@/krittengine/model/spatialEntity.types';
import { vec3 } from 'gl-matrix';

export type ParamsBox = ParamsSpatialEntity & {
  cornerMin?: vec3;
  cornerMax?: vec3;
};
