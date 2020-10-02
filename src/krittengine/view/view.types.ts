import { Ray } from '@/krittengine/model/ray';

export interface InterfaceRenderableWithRaytracer {
  intersectsWithRay(ray: Ray): boolean;
  // intersectsWithRayAndPosition(ray: Ray): [boolean];
}
