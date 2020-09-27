import { Camera } from '@/krittengine/model/camera';
import { IDCamera } from '@/krittengine/model/camera.types';
import { ParamsEntity } from '@/krittengine/model/entity.types';

export type IDScene = string;

export interface InterfaceScene {
  addCamera(camera: Camera): void;
  getCamera(id: IDCamera): Camera;
  getActiveCamera(): Camera;
}

export type ParamsScene = ParamsEntity & {
  id?: IDScene;
};
