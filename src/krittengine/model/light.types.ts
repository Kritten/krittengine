import { ParamsSpatialEntity } from '@/krittengine/model/spatialEntity.types';
import { vec3 } from 'gl-matrix';

export type IDLight = string;

export type ParamsLight = ParamsSpatialEntity & {
  id?: IDLight;
  color?: vec3;
  intensityA?: number;
  intensityB?: number;
  intensityC?: number;
};
