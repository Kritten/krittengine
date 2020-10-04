import { Camera } from '@/krittengine/model/camera';
import { ParamsEntity } from '@/krittengine/model/entity.types';
import { ShapeEntity } from '@/krittengine/model/shapes/shapeEntity';
import { Light } from '@/krittengine/model/light';

export type IDScene = string;

export interface InterfaceScene {
  addCamera(camera: Camera): void;
  addObject(object: ShapeEntity): void;
  addLight(light: Light): void;
  setActiveCamera(camera: Camera): Camera;
}

export type ParamsScene = ParamsEntity & {
  id?: IDScene;
};
