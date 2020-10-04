import { Ray } from '@/krittengine/model/ray';
import { vec3 } from 'gl-matrix';
import { Material } from '@/krittengine/model/material';

export interface InterfaceDataIntersection {
  point: vec3;
  normal: vec3;
  material: Material;
}

export interface InterfaceRenderableWithRaytracer {
  intersectsWithRay(ray: Ray): InterfaceDataIntersection | false;
  getNormal(point: vec3): vec3;
}
