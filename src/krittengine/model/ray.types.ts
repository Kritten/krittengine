import { ParamsSpatialEntity } from '@/krittengine/model/spatialEntity.types';

export type IDRay = string;

export type ParamsRay = ParamsSpatialEntity & {
  id?: IDRay;
};
