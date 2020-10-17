import type { mat4 } from 'gl-matrix';
import type { InterfaceSpatialEntity, ParamsSpatialEntity, SerializedSpatialEntity } from '@/krittengine/model/spatialEntity.types';
import { vec3 } from 'gl-matrix';

export type IDCamera = string;

export type ParamsCamera = ParamsSpatialEntity & {
  id?: IDCamera;
};

export type SerializedCamera = SerializedSpatialEntity & {
  matrixPerspective?: mat4;
};

export interface InterfaceCamera extends InterfaceSpatialEntity {
  viewingDirection: vec3;
  matrixPerspective: mat4;
  matrixPerspectiveInverse: mat4;
  matrixView: mat4;
  matrixViewInverse: mat4;

  update(): void;
  updateAspectRatio(): void;
  recalculateMatrixView(): void;
  updateViewingDirection(): void;

  serialize(): SerializedCamera;
}
