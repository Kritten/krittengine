import { ParamsEntity } from '@/krittengine/model/entity.types';

export type IDMaterial = string;

export type ParamsMaterial = ParamsEntity & {
  id?: IDMaterial;
};
