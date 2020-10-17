import type { InterfaceSpatialEntity, ParamsSpatialEntity, SerializedSpatialEntity } from '@/krittengine/model/spatialEntity.types';
import type { Material } from '@/krittengine/model/material';
import { SerializedMaterial } from '@/krittengine/model/material.types';

export type IDShapeEntity = string;

export type ParamsShapeEntity = ParamsSpatialEntity & {
  id?: IDShapeEntity;
  material?: Material;
};

export type SerializedShapeEntity = SerializedSpatialEntity & {
  material: SerializedMaterial;
};

export interface InterfaceShapeEntity extends InterfaceSpatialEntity {
  material: Material;

  serialize(): SerializedShapeEntity;
}
