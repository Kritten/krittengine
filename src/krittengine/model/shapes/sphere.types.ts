import type { ParamsSpatialEntity } from '@/krittengine/model/spatialEntity.types';
import { InterfaceShapeEntity, SerializedShapeEntity } from '@/krittengine/model/shapes/shapeEntity.types';

export type ParamsSphere = ParamsSpatialEntity & {
  radius?: number;
};

export type SerializedSphere = SerializedShapeEntity & {
  radius: number;
};

export interface InterfaceSphere extends InterfaceShapeEntity {
  radius: number;

  serialize(): SerializedSphere;
}
