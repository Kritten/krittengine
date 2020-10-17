import type { Camera } from '@/krittengine/model/camera';
import type { InterfaceEntity, ParamsEntity, SerializedEntity } from '@/krittengine/model/entity.types';
import type { ShapeEntity } from '@/krittengine/model/shapes/shapeEntity';
import type { Light } from '@/krittengine/model/light';
import type { IDCamera, SerializedCamera } from '@/krittengine/model/camera.types';
import type { IDLight, SerializedLight } from '@/krittengine/model/light.types';
import type { vec4 } from 'gl-matrix';
import type { IDShapeEntity, SerializedShapeEntity } from '@/krittengine/model/shapes/shapeEntity.types';

export type IDScene = string;

export type SerializedScene = SerializedEntity & {
  id: IDScene;
  cameras: SerializedCamera[];
  lights: SerializedLight[];
  lightAmbient: vec4;
  objects: SerializedShapeEntity[];
  activeCamera: SerializedCamera;
};

export interface InterfaceScene extends InterfaceEntity {
  cameras: Map<IDCamera, Camera>;
  lights: Map<IDLight, Light>;
  lightAmbient: vec4;
  objects: Map<IDShapeEntity, ShapeEntity>;
  activeCamera: Camera;

  addCamera(camera: Camera): void;
  addObject(object: ShapeEntity): void;
  addLight(light: Light): void;
  setActiveCamera(camera: Camera): Camera;
  update(): void;

  serialize(): SerializedScene;
}

export type ParamsScene = ParamsEntity & {
  id?: IDScene;
};
