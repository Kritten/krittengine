import type { InterfaceEntity, ParamsEntity, SerializedEntity } from '@/krittengine/model/entity.types';
import { vec3 } from 'gl-matrix';

export type IDMaterial = string;

export type ParamsMaterial = ParamsEntity & {
  id?: IDMaterial;
};

export type SerializedMaterial = SerializedEntity & {
  id: IDMaterial;
  coefficientAmbient: vec3;
  coefficientDiffuse: vec3;
  coefficientSpecular: vec3;
  specularFalloff: number;
};

export interface InterfaceMaterial extends InterfaceEntity {
  serialize(): SerializedMaterial;
}
