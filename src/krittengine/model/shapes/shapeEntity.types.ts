import { ParamsSpatialEntity } from '@/krittengine/model/spatialEntity.types';
import { Material } from '@/krittengine/model/material';

export type IDShapeEntity = string;

export type ParamsShapeEntity = ParamsSpatialEntity & {
  id?: IDShapeEntity;
  material?: Material;
};
