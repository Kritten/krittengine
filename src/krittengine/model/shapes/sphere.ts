import { InterfaceSphere, ParamsSphere, SerializedSphere } from '@/krittengine/model/shapes/sphere.types';
import { ShapeEntity } from '@/krittengine/model/shapes/shapeEntity';
import { Ray } from '@/krittengine/model/ray';
import { vec3 } from 'gl-matrix';
import { InterfaceDataIntersection } from '@/krittengine/view/view.types';
import { transformDirectionWithMat4 } from '@/krittengine/controller/helpers';

export class Sphere extends ShapeEntity implements InterfaceSphere {
  radius = 1;

  constructor(params: ParamsSphere = {}) {
    super(params);
  }

  intersectsWithRay(rayObjectSpace: Ray, print: boolean): number | undefined {
    const sphereToRayOrigin = vec3.subtract(vec3.create(), rayObjectSpace.position, [0, 0, 0]);
    // const sphereToRayOrigin = vec3.subtract(vec3.create(), rayObjectSpace.position, this.position);

    // const directionRay = vec3.transformQuat(vec3.create(), DIRECTION_RAY_INITIAL, rayObjectSpace.rotation);
    const directionRay = rayObjectSpace.direction;
    // const rayOriginToSphere = vec3.subtract(vec3.create(), sphere.position, rayObjectSpace.position);
    // console.log(rayOriginToSphere, 'rayOriginToSphere');
    // console.log(directionRay, 'directionRay');
    // const t = vec3.dot(rayOriginToSphere, directionRay);
    // const p = vec3.scaleAndAdd(vec3.create(), rayObjectSpace.position, directionRay, t);
    // const y = vec3.len(vec3.subtract(vec3.create(), sphere.position, p));
    //
    // if (y <= sphere.radius) {
    //   return true;
    // }

    const a = vec3.dot(directionRay, directionRay);
    // const a = 1;
    const b = 2.0 * vec3.dot(sphereToRayOrigin, directionRay);
    const c = vec3.dot(sphereToRayOrigin, sphereToRayOrigin) - 1 ** 2;
    // const c = vec3.dot(sphereToRayOrigin, sphereToRayOrigin) - this.radius ** 2;

    const discriminant = b ** 2 - 4 * a * c;
    if (print) {
      // eslint-disable-next-line no-console
      console.log(rayObjectSpace, 'rayObjectSpace');
      // eslint-disable-next-line no-console
      console.warn(discriminant, 'discriminant');
    }

    if (discriminant < 0) {
      return undefined;
    }
    // console.log(discriminant, 'discriminant');
    // treats the case of discriminant = 0 (rayObjectSpace way tangential to the sphere) the same as an intersection

    const numerator = -b - Math.sqrt(discriminant);
    // const numerator2 = -b + Math.sqrt(discriminant);
    // const numerator = Math.min(numerator1, numerator2);

    if (print) {
      // eslint-disable-next-line no-console
      console.warn(numerator, 'numerator');
    }
    if (numerator >= 0) {
      return numerator / (2.0 * a);
    }

    return undefined;
    // rayObjectSpace starts inside of sphere
    // numerator = -b + Math.sqrt(discriminant);
    // if (numerator > 0) {
    //   // console.warn(numerator / (2.0 * a), '+++++++++++++++++++++++++');
    //   return true;
    // }

    // console.warn(-1, '+++++++++++++++++++++++++');
  }

  getIntersectionData(rayObjectSpace: Ray, t: number): InterfaceDataIntersection {
    const pointIntersection = vec3.scaleAndAdd(vec3.create(), rayObjectSpace.position, rayObjectSpace.direction, t);
    const normalObjectSpace = this.getNormal(pointIntersection);

    const pointWorldSpace = vec3.transformMat4(vec3.create(), pointIntersection, this.matrixTransformation);
    const normalWorldSpace = transformDirectionWithMat4(normalObjectSpace, this.matrixTransformation);

    return {
      material: this.material,
      pointObjectSpace: pointIntersection,
      normalObjectSpace,
      pointWorldSpace,
      normalWorldSpace,
    };
  }

  getNormal(pointObjectSpace: vec3): vec3 {
    return pointObjectSpace; // unit sphere: intersection point is normal
  }

  serialize(): SerializedSphere {
    return {
      ...super.serialize(),
      radius: this.radius,
    };
  }
}
