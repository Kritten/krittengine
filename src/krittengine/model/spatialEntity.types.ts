import type { InterfaceEntity, ParamsEntity, SerializedEntity } from '@/krittengine/model/entity.types';
import type { mat4, quat, vec3 } from 'gl-matrix';

export type IDSpatialEntity = string;

export type ParamsSpatialEntity = ParamsEntity & {
  id?: IDSpatialEntity;
  position?: vec3;
  rotation?: quat;
  scale?: vec3;
};

export type SerializedSpatialEntity = SerializedEntity & {
  id: IDSpatialEntity;
  position: vec3;
  rotation: quat;
  scale: vec3;
};

export interface InterfaceSpatialEntity extends InterfaceEntity {
  position: vec3;
  rotation: quat;
  scale: vec3;
  matrixTransformation: mat4;
  matrixTransformationInverse: mat4;

  init(): void;
  updateMatrixTransformation(): void;

  serialize(): SerializedSpatialEntity;
}
