import type { InterfaceSpatialEntity, ParamsSpatialEntity, SerializedSpatialEntity } from '@/krittengine/model/spatialEntity.types';
import type { vec3 } from 'gl-matrix';

export type IDLight = string;

export type ParamsLight = ParamsSpatialEntity & {
  id?: IDLight;
  color?: vec3;
  intensityA?: number;
  intensityB?: number;
  intensityC?: number;
};

export type SerializedLight = SerializedSpatialEntity & {
  id: IDLight;
  color: vec3;
  intensityA: number;
  intensityB: number;
  intensityC: number;
};

export interface InterfaceLight extends InterfaceSpatialEntity {
  serialize(): SerializedLight;
}
