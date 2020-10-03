import { ParamsSpatialEntity } from '@/krittengine/model/spatialEntity.types';

export type IDLight = string;

export type ParamsLight = ParamsSpatialEntity & {
  id?: IDLight;
};
