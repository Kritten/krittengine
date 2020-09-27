import { Scene } from '@/krittengine/model/scene';
import { IDScene } from '@/krittengine/model/scene.types';
import { Camera } from '@/krittengine/model/camera';
import { IDCamera } from '@/krittengine/model/camera.types';

export interface InterfaceSceneBuilder {
  getScenes(): Map<IDScene, Scene>;
  getActiveScene(): Scene;
  createScene(id: IDScene): Scene;

  createCamera(id: IDCamera): Camera;
}
