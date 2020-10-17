import { SpatialEntity } from '@/krittengine/model/spatialEntity';
import { InterfaceShapeEntity, ParamsShapeEntity, SerializedShapeEntity } from '@/krittengine/model/shapes/shapeEntity.types';
import { InterfaceDataIntersection, InterfaceRenderableWithRaytracer } from '@/krittengine/view/view.types';
import { Ray } from '@/krittengine/model/ray';
import { vec3 } from 'gl-matrix';
import { Material } from '@/krittengine/model/material';

export abstract class ShapeEntity extends SpatialEntity implements InterfaceShapeEntity, InterfaceRenderableWithRaytracer {
  material = new Material();

  protected constructor(params: ParamsShapeEntity = {}) {
    super(params);

    if (params.material !== undefined) {
      this.material = params.material;
    }
  }

  abstract intersectsWithRay(rayObjectSpace: Ray, print: boolean): number | undefined;

  abstract getIntersectionData(rayObjectSpace: Ray, t: number): InterfaceDataIntersection;

  abstract getNormal(pointObjectSpace: vec3): vec3;

  serialize(): SerializedShapeEntity {
    return {
      ...super.serialize(),
      material: this.material.serialize(),
    };
  }
}
