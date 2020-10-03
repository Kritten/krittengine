import { InterfaceScene, ParamsScene } from '@/krittengine/model/scene.types';
import { IDCamera } from '@/krittengine/model/camera.types';
import { Camera } from '@/krittengine/model/camera';
import { Entity } from '@/krittengine/model/entity';
import { ShapeEntity } from '@/krittengine/model/shapes/shapeEntity';
import { IDShapeEntity } from '@/krittengine/model/shapes/shapeEntity.types';
import { Light } from '@/krittengine/model/light';
import { IDLight } from '@/krittengine/model/light.types';

export class Scene extends Entity implements InterfaceScene {
  private cameras: Map<IDCamera, Camera> = new Map();

  private lights: Map<IDLight, Light> = new Map();

  private objects: Map<IDShapeEntity, ShapeEntity> = new Map();

  private activeCamera: Camera;

  constructor(params: ParamsScene = {}) {
    super(params);
  }

  addCamera(camera: Camera): void {
    this.cameras.set(camera.id, camera);

    if (this.cameras.size === 1) {
      this.activeCamera = camera;
    }
  }

  addObject(object: ShapeEntity): void {
    this.objects.set(object.id, object);
  }

  getActiveCamera(): Camera {
    return this.activeCamera;
  }

  setActiveCamera(camera: Camera): Camera {
    const cameraActive = this.cameras.get(camera.id);

    if (cameraActive !== undefined) {
      this.activeCamera = cameraActive;
    } else {
      throw new Error(`Camera '${camera.id}' not found`);
    }

    return this.activeCamera;
  }

  getCamera(id: IDCamera): Camera {
    const camera = this.cameras.get(id);

    if (camera === undefined) {
      throw new Error(`Camera '${id}' not found`);
    }

    return camera;
  }

  getObjects(): Map<string, ShapeEntity> {
    return this.objects;
  }

  addLight(light: Light): void {
    this.lights.set(light.id, light);
  }
}
