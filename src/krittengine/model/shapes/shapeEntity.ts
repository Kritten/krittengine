import { SpatialEntity } from '@/krittengine/model/spatialEntity';
import { ParamsShapeEntity } from '@/krittengine/model/shapes/shapeEntity.types';
import { InterfaceRenderableWithRaytracer } from '@/krittengine/view/view.types';
import { Ray } from '@/krittengine/model/ray';

export abstract class ShapeEntity extends SpatialEntity implements InterfaceRenderableWithRaytracer {
  constructor(params: ParamsShapeEntity = {}) {
    super(params);
  }

  abstract intersectsWithRay(ray: Ray): boolean;
}
