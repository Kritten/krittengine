import { IDScene } from '@/krittengine/model/scene.types';
import { Scene } from '@/krittengine/model/scene';
import { InterfaceSceneBuilder } from '@/sceneBuilder/sceneBuilder.types';
import { IDCamera } from '@/krittengine/model/camera.types';
import { Camera } from '@/krittengine/model/camera';

export class SceneBuilder implements InterfaceSceneBuilder {
  private scenes: Map<IDScene, Scene> = new Map();

  private activeScene: Scene;

  createScene(id: IDScene): Scene {
    const scene = new Scene({ id });

    this.scenes.set(scene.id, scene);

    if (this.scenes.size === 1) {
      this.activeScene = scene;
    }

    return scene;
  }

  getScenes(): Map<IDScene, Scene> {
    return this.scenes;
  }

  getActiveScene(): Scene {
    return this.activeScene;
  }

  // eslint-disable-next-line class-methods-use-this
  createCamera(id: IDCamera): Camera {
    return new Camera({ id });
  }
}
