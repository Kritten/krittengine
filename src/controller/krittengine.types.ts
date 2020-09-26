export type NameRenderingTechnique = 'raytracer';

export type Config = {
  loop?: boolean;
  renderingTechnique?: NameRenderingTechnique;
  dimensions?: { width: number; height: number };
};
