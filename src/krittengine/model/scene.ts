import { InterfaceScene, ParamsScene } from '@/krittengine/model/scene.types';
import { IDCamera } from '@/krittengine/model/camera.types';
import { Camera } from '@/krittengine/model/camera';
import { Entity } from '@/krittengine/model/entity';

export class Scene extends Entity implements InterfaceScene {
  private cameras: Map<IDCamera, Camera> = new Map();

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

  getActiveCamera(): Camera {
    return this.activeCamera;
  }

  getCamera(id: IDCamera): Camera {
    return this.cameras.get(id);
  }
}
