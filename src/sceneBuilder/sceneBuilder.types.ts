import { Scene } from '@/krittengine/model/scene';
import { IDScene } from '@/krittengine/model/scene.types';
import { Camera } from '@/krittengine/model/camera';
import { IDCamera } from '@/krittengine/model/camera.types';
import { IDShapeEntity } from '@/krittengine/model/shapes/shapeEntity.types';
import { Sphere } from '@/krittengine/model/shapes/sphere';
import { Light } from '@/krittengine/model/light';
import { IDLight } from '@/krittengine/model/light.types';
import { IDMaterial } from '@/krittengine/model/material.types';
import { Material } from '@/krittengine/model/material';
import { Box } from '@/krittengine/model/shapes/box';

export interface InterfaceSceneBuilder {
  createScene(id: IDScene): Scene;
  createCamera(id: IDCamera): Camera;
  createSphere(id: IDShapeEntity): Sphere;
  createBox(id: IDShapeEntity): Box;
  createLight(id: IDLight): Light;
  createMaterial(id: IDMaterial): Material;
}
