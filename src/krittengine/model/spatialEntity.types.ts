import { ParamsEntity } from '@/krittengine/model/entity.types';
import { quat, vec3 } from 'gl-matrix';

export type IDSpatialEntity = string;

export type ParamsSpatialEntity = ParamsEntity & {
  id?: IDSpatialEntity;
  position?: vec3;
  rotation?: quat;
  scale?: vec3;
};
