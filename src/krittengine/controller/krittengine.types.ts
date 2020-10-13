import type { SceneBuilder } from '@/sceneBuilder/sceneBuilder';
import type { Scene } from '@/krittengine/model/scene';

export type NameRenderingTechnique = 'raytracer';

export type Dimensions = { width: number; height: number };

export type ConfigKrittengine = {
  loop: boolean;
  renderingTechnique: NameRenderingTechnique;
  dimensions: Dimensions;
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
  startFullscreen(): void;
  lockMouse(): void;
}
