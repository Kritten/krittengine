import { Ray } from '@/krittengine/model/ray';
import { vec3, vec4 } from 'gl-matrix';

export interface InterfaceDataIntersection {
  color?: vec4;
  pointIntersection?: vec3;
  normal?: vec3;
}

export interface InterfaceRenderableWithRaytracer {
  intersectsWithRay(ray: Ray): InterfaceDataIntersection;
  getNormal(point: vec3): vec3;
}
