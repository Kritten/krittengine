import { Scene } from '@/krittengine/model/scene';
import { IDScene } from '@/krittengine/model/scene.types';
import { Camera } from '@/krittengine/model/camera';
import { IDCamera } from '@/krittengine/model/camera.types';
import { IDShapeEntity } from '@/krittengine/model/shapes/shapeEntity.types';
import { Sphere } from '@/krittengine/model/shapes/sphere';

export interface InterfaceSceneBuilder {
  createScene(id: IDScene): Scene;
  createCamera(id: IDCamera): Camera;
  createSphere(id: IDShapeEntity): Sphere;
}
