import { SpatialEntity } from '@/krittengine/model/spatialEntity';
import { ParamsShapeEntity } from '@/krittengine/model/shapes/shapeEntity.types';
import { InterfaceDataIntersection, InterfaceRenderableWithRaytracer } from '@/krittengine/view/view.types';
import { Ray } from '@/krittengine/model/ray';
import { vec3 } from 'gl-matrix';

export abstract class ShapeEntity extends SpatialEntity implements InterfaceRenderableWithRaytracer {
  constructor(params: ParamsShapeEntity = {}) {
    super(params);
  }

  abstract intersectsWithRay(ray: Ray): InterfaceDataIntersection;

  abstract getNormal(point: vec3): vec3;
}
