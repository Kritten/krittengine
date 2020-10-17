import type { ParamsSpatialEntity } from '@/krittengine/model/spatialEntity.types';
import type { vec3 } from 'gl-matrix';

export type IDRay = string;

export type ParamsRay = ParamsSpatialEntity & {
  id?: IDRay;
  direction: vec3;
};
