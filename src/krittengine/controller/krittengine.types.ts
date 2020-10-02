import { SceneBuilder } from '@/sceneBuilder/sceneBuilder';
import { Scene } from '@/krittengine/model/scene';

export type NameRenderingTechnique = 'raytracer';

export type ConfigKrittengine = {
  loop: boolean;
  renderingTechnique: NameRenderingTechnique;
  dimensions: { width: number; height: number };
  // scene?: IDScene;
};

export type ConfigKrittengineInitial = Partial<ConfigKrittengine>;

export interface InterfaceKrittengine {
  start(config: ConfigKrittengine): void;
  stop(): void;
  continue(): void;
  updateConfig(config: ConfigKrittengine): void;
  getSceneBuilder(): SceneBuilder;
  addScene(scene: Scene): void;
}
