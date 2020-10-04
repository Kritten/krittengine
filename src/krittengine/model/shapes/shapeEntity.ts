import { SpatialEntity } from '@/krittengine/model/spatialEntity';
import { ParamsShapeEntity } from '@/krittengine/model/shapes/shapeEntity.types';
import { InterfaceDataIntersection, InterfaceRenderableWithRaytracer } from '@/krittengine/view/view.types';
import { Ray } from '@/krittengine/model/ray';
import { vec3 } from 'gl-matrix';
import { Material } from '@/krittengine/model/material';

export abstract class ShapeEntity extends SpatialEntity implements InterfaceRenderableWithRaytracer {
  material = new Material();

  protected constructor(params: ParamsShapeEntity = {}) {
    super(params);

    if (params.material !== undefined) {
      this.material = params.material;
    }
  }

  abstract intersectsWithRay(ray: Ray): InterfaceDataIntersection | false;

  abstract getNormal(point: vec3): vec3;
}
