import { mat4 } from 'gl-matrix';
import { ParamsSpatialEntity } from '@/krittengine/model/spatialEntity.types';

export type IDCamera = string;

export type ParamsCamera = ParamsSpatialEntity & {
  id?: IDCamera;
  matrixPerspective?: mat4;
};
