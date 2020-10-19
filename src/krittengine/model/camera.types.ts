import type { mat4, vec3 } from 'gl-matrix';
import type { InterfaceSpatialEntity, ParamsSpatialEntity, SerializedSpatialEntity } from '@/krittengine/model/spatialEntity.types';
import type { Dimensions } from '@/krittengine/controller/krittengine.types';

export type IDCamera = string;

export type ParamsCamera = ParamsSpatialEntity & {
  id?: IDCamera;
  aspectRatio?: number;
};

export type SerializedCamera = SerializedSpatialEntity & {
  aspectRatio: number;
  matrixPerspective: mat4;
};

export interface InterfaceCamera extends InterfaceSpatialEntity {
  viewingDirection: vec3;
  matrixPerspective: mat4;
  matrixPerspectiveInverse: mat4;
  matrixView: mat4;
  matrixViewInverse: mat4;

  update(): void;
  updateAspectRatio(dimensions?: Dimensions): void;
  recalculateMatrixView(): void;
  updateViewingDirection(): void;

  serialize(): SerializedCamera;
}
