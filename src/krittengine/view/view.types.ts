import { Ray } from '@/krittengine/model/ray';
import { vec3 } from 'gl-matrix';
import { Material } from '@/krittengine/model/material';

export interface InterfaceDataIntersection {
  pointObjectSpace: vec3;
  normalObjectSpace: vec3;

  pointWorldSpace: vec3;
  normalWorldSpace: vec3;

  material: Material;
}

export interface InterfaceRenderableWithRaytracer {
  intersectsWithRay(rayObjectSpace: Ray, print: boolean): number | undefined;
  getIntersectionData(rayObjectSpace: Ray, t: number): InterfaceDataIntersection;
  getNormal(pointObjectSpace: vec3): vec3;
}
