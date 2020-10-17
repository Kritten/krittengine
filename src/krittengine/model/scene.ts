import { InterfaceScene, ParamsScene, SerializedScene } from '@/krittengine/model/scene.types';
import { IDCamera } from '@/krittengine/model/camera.types';
import { Camera } from '@/krittengine/model/camera';
import { Entity } from '@/krittengine/model/entity';
import { ShapeEntity } from '@/krittengine/model/shapes/shapeEntity';
import { IDShapeEntity } from '@/krittengine/model/shapes/shapeEntity.types';
import { Light } from '@/krittengine/model/light';
import { IDLight } from '@/krittengine/model/light.types';
import { vec4 } from 'gl-matrix';

export class Scene extends Entity implements InterfaceScene {
  cameras: Map<IDCamera, Camera> = new Map();

  lights: Map<IDLight, Light> = new Map();

  lightAmbient = vec4.fromValues(0.0, 0.0, 0.0, 1.0);

  objects: Map<IDShapeEntity, ShapeEntity> = new Map();

  activeCamera: Camera;

  constructor(params: ParamsScene = {}) {
    super(params);
  }

  update(): void {
    for (const [, camera] of this.cameras) {
      camera.update();
    }
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

  setActiveCamera(camera: Camera): Camera {
    const cameraActive = this.cameras.get(camera.id);

    if (cameraActive !== undefined) {
      this.activeCamera = cameraActive;
    } else {
      throw new Error(`Camera '${camera.id}' not found`);
    }

    return this.activeCamera;
  }

  addLight(light: Light): void {
    this.lights.set(light.id, light);
  }

  serialize(): SerializedScene {
    const cameras = [];
    for (const [, camera] of this.cameras) {
      cameras.push(camera.serialize());
    }
    const lights = [];
    for (const [, light] of this.lights) {
      lights.push(light.serialize());
    }
    const objects = [];
    for (const [, object] of this.objects) {
      objects.push(object.serialize());
    }

    return {
      ...super.serialize(),
      cameras,
      objects,
      lights,
      lightAmbient: this.lightAmbient,
      activeCamera: this.activeCamera.serialize(),
    };
  }
}
