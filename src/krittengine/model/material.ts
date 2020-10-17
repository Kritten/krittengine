import { Entity } from '@/krittengine/model/entity';
import { InterfaceMaterial, ParamsMaterial, SerializedMaterial } from '@/krittengine/model/material.types';
import { vec3 } from 'gl-matrix';

export class Material extends Entity implements InterfaceMaterial {
  coefficientAmbient = vec3.create();

  coefficientDiffuse = vec3.create();

  coefficientSpecular = vec3.create();

  specularFalloff = 100;

  constructor(params: ParamsMaterial = {}) {
    super(params);
  }

  serialize(): SerializedMaterial {
    return {
      ...super.serialize(),
      coefficientAmbient: this.coefficientAmbient,
      coefficientDiffuse: this.coefficientDiffuse,
      coefficientSpecular: this.coefficientSpecular,
      specularFalloff: this.specularFalloff,
    };
  }
}
