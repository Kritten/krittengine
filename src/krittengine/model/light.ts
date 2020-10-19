import { SpatialEntity } from '@/krittengine/model/spatialEntity';
import { InterfaceLight, ParamsLight, SerializedLight } from '@/krittengine/model/light.types';
import { vec3 } from 'gl-matrix';

export class Light extends SpatialEntity implements InterfaceLight {
  color = vec3.fromValues(1.0, 1.0, 1.0);

  intensityA = 0;

  intensityB = 0.05;

  intensityC = 1;

  constructor(params: ParamsLight = {}) {
    super(params);

    if (params.color !== undefined) {
      this.color = params.color;
    }

    if (params.intensityA !== undefined) {
      this.intensityA = params.intensityA;
    }

    if (params.intensityB !== undefined) {
      this.intensityB = params.intensityB;
    }

    if (params.intensityC !== undefined) {
      this.intensityC = params.intensityC;
    }
  }

  serialize(): SerializedLight {
    return {
      ...super.serialize(),
      color: this.color,
      intensityA: this.intensityA,
      intensityB: this.intensityB,
      intensityC: this.intensityC,
    };
  }

  static deserialize(data: SerializedLight): Light {
    return new Light(data);
  }
}
