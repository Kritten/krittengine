import { IDScene } from '@/krittengine/model/scene.types';

export type NameRenderingTechnique = 'raytracer';

export type ConfigKrittengineInitial = {
  loop?: boolean;
  renderingTechnique?: NameRenderingTechnique;
  dimensions?: { width: number; height: number };
};

export type ConfigKrittengine = ConfigKrittengineInitial & {
  scene?: IDScene;
};
