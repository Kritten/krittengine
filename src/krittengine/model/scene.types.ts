import { Camera } from '@/krittengine/model/camera';
import { IDCamera } from '@/krittengine/model/camera.types';
import { ParamsEntity } from '@/krittengine/model/entity.types';
import { ShapeEntity } from '@/krittengine/model/shapes/shapeEntity';
import { IDShapeEntity } from '@/krittengine/model/shapes/shapeEntity.types';
import { Light } from '@/krittengine/model/light';

export type IDScene = string;

export interface InterfaceScene {
  addCamera(camera: Camera): void;
  addObject(object: ShapeEntity): void;
  addLight(light: Light): void;
  getObjects(): Map<IDShapeEntity, ShapeEntity>;
  getCamera(id: IDCamera): Camera;
  getActiveCamera(): Camera;
  setActiveCamera(camera: Camera): Camera;
}

export type ParamsScene = ParamsEntity & {
  id?: IDScene;
};
