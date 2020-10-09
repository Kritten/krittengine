import { ShapeEntity } from '@/krittengine/model/shapes/shapeEntity';
import { Ray } from '@/krittengine/model/ray';
import { vec3 } from 'gl-matrix';
import { InterfaceDataIntersection } from '@/krittengine/view/view.types';
import { ParamsBox } from '@/krittengine/model/shapes/box.types';
import { transformDirectionWithMat4 } from '@/krittengine/controller/helpers';

export class Box extends ShapeEntity {
  cornerMin = vec3.fromValues(0.5, 0.5, 0.5);

  cornerMax = vec3.fromValues(0.5, 0.5, 0.5);

  constructor(params: ParamsBox = {}) {
    super(params);

    if (params.cornerMin !== undefined) {
      this.cornerMin = params.cornerMin;
    }

    if (params.cornerMax !== undefined) {
      this.cornerMax = params.cornerMax;
    }
  }

  intersectsWithRay(rayObjectSpace: Ray): number | undefined {
    // copied from https://github.com/stackgl/ray-aabb-intersection
    let result;

    let low = -Infinity;
    let high = +Infinity;

    for (let i = 0; i < 3; i += 1) {
      let dimLo = (-0.5 - rayObjectSpace.position[i]) / rayObjectSpace.direction[i];
      let dimHi = (0.5 - rayObjectSpace.position[i]) / rayObjectSpace.direction[i];

      if (dimLo > dimHi) {
        const tmp = dimLo;
        dimLo = dimHi;
        dimHi = tmp;
      }

      if (dimHi < low || dimLo > high) {
        result = Infinity;
        break;
      }

      if (dimLo > low) low = dimLo;
      if (dimHi < high) high = dimHi;
    }

    if (result === Infinity || low > high) {
      return undefined;
    }

    return low;
  }

  getIntersectionData(rayObjectSpace: Ray, t: number): InterfaceDataIntersection {
    const pointObjectSpace = vec3.scaleAndAdd(vec3.create(), rayObjectSpace.position, rayObjectSpace.direction, t);

    const pointWorldSpace = vec3.transformMat4(vec3.create(), pointObjectSpace, this.matrixTransformation);

    const normalObjectSpace = this.getNormal(pointObjectSpace);
    // console.warn(pointObjectSpace, normalObjectSpace, 'pointObjectSpace, normalObjectSpace');
    const normalWorldSpace = transformDirectionWithMat4(normalObjectSpace, this.matrixTransformation);
    // console.log(pointWorldSpace, normalWorldSpace, 'pointWorldSpace, normalWorldSpace');

    return {
      material: this.material,
      pointObjectSpace,
      normalObjectSpace,
      pointWorldSpace,
      normalWorldSpace,
    };
  }

  getNormal(pointObjectSpace: vec3): vec3 {
    if (pointObjectSpace[0] === 0.5) {
      return [1, 0, 0];
    }
    if (pointObjectSpace[1] === 0.5) {
      return [0, 1, 0];
    }
    if (pointObjectSpace[2] === 0.5) {
      return [0, 0, 1];
    }
    if (pointObjectSpace[0] === -0.5) {
      return [-1, 0, 0];
    }
    if (pointObjectSpace[1] === -0.5) {
      return [0, -1, 0];
    }
    if (pointObjectSpace[2] === -0.5) {
      return [0, 0, -1];
    }
    return [0, 0, 1];
  }
}
