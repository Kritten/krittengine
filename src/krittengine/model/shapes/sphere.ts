import { ParamsSphere } from '@/krittengine/model/shapes/sphere.types';
import { ShapeEntity } from '@/krittengine/model/shapes/shapeEntity';
import { Ray } from '@/krittengine/model/ray';
import { vec3 } from 'gl-matrix';
import { DIRECTION_RAY_INITIAL } from '@/krittengine/controller/constants';

export class Sphere extends ShapeEntity {
  radius = 1;

  constructor(params: ParamsSphere = {}) {
    super(params);

    if (params.radius !== undefined) {
      this.radius = params.radius;
    }
  }

  intersectsWithRay(ray: Ray): boolean {
    const sphereToRayOrigin = vec3.subtract(vec3.create(), ray.position, this.position);
    const directionRay = vec3.transformQuat(vec3.create(), DIRECTION_RAY_INITIAL, ray.rotation);
    vec3.normalize(directionRay, directionRay);
    // const rayOriginToSphere = vec3.subtract(vec3.create(), sphere.position, ray.position);
    // console.log(rayOriginToSphere, 'rayOriginToSphere');
    // console.log(directionRay, 'directionRay');
    // const t = vec3.dot(rayOriginToSphere, directionRay);
    // const p = vec3.scaleAndAdd(vec3.create(), ray.position, directionRay, t);
    // const y = vec3.len(vec3.subtract(vec3.create(), sphere.position, p));
    //
    // if (y <= sphere.radius) {
    //   return true;
    // }

    const a = vec3.dot(directionRay, directionRay);
    const b = 2.0 * vec3.dot(sphereToRayOrigin, directionRay);
    const c = vec3.dot(sphereToRayOrigin, sphereToRayOrigin) - this.radius ** 2;

    const discriminant = b ** 2 - 4 * a * c;
    // console.warn(discriminant, 'discriminant');

    if (discriminant < 0) {
      return false;
    }

    // treats the case of t = 0 (ray way tangential to the sphere) the same as an intersection
    const numerator = -b - Math.sqrt(discriminant);
    if (numerator > 0) {
      // console.warn(numerator / (2.0 * a), '+++++++++++++++++++++++++');
      return true;
    }
    return false;
    // ray starts inside of sphere
    // numerator = -b + Math.sqrt(discriminant);
    // if (numerator > 0) {
    //   // console.warn(numerator / (2.0 * a), '+++++++++++++++++++++++++');
    //   return true;
    // }

    // console.warn(-1, '+++++++++++++++++++++++++');
  }
}
