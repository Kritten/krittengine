import type { ParamsSpatialEntity } from '@/krittengine/model/spatialEntity.types';
import type { vec3 } from 'gl-matrix';
import { InterfaceShapeEntity, SerializedShapeEntity } from '@/krittengine/model/shapes/shapeEntity.types';

export type ParamsBox = ParamsSpatialEntity & {
  cornerMin?: vec3;
  cornerMax?: vec3;
};

export type SerializedBox = SerializedShapeEntity & {
  cornerMin: vec3;
  cornerMax: vec3;
};

export interface InterfaceBox extends InterfaceShapeEntity {
  cornerMin: vec3;
  cornerMax: vec3;

  serialize(): SerializedBox;
}
