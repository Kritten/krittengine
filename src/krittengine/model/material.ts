import { Entity } from '@/krittengine/model/entity';
import { ParamsMaterial } from '@/krittengine/model/material.types';
import { vec3 } from 'gl-matrix';

export class Material extends Entity {
  coefficientAmbient = vec3.create();

  coefficientDiffuse = vec3.create();

  coefficientSpecular = vec3.create();

  specularFalloff = 100;

  constructor(params: ParamsMaterial = {}) {
    super(params);
  }
}
