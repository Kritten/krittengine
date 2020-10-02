/* eslint-disable class-methods-use-this */

import { IDScene } from '@/krittengine/model/scene.types';
import { Scene } from '@/krittengine/model/scene';
import { InterfaceSceneBuilder } from '@/sceneBuilder/sceneBuilder.types';
import { IDCamera } from '@/krittengine/model/camera.types';
import { Camera } from '@/krittengine/model/camera';
import { Sphere } from '@/krittengine/model/shapes/sphere';
import { IDShapeEntity } from '@/krittengine/model/shapes/shapeEntity.types';

export class SceneBuilder implements InterfaceSceneBuilder {
  createScene(id: IDScene): Scene {
    return new Scene({ id });
  }

  createCamera(id: IDCamera): Camera {
    return new Camera({ id });
  }

  createSphere(id: IDShapeEntity): Sphere {
    return new Sphere({ id });
  }
}
