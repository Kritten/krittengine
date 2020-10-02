import { ParamsSpatialEntity } from '@/krittengine/model/spatialEntity.types';

export type IDShapeEntity = string;

export type ParamsShapeEntity = ParamsSpatialEntity & {
  id?: IDShapeEntity;
};
