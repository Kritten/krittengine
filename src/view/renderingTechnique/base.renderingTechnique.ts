import { Scene } from '@/model/scene';
import { Config } from '@/controller/krittengine.types';

export interface InterfaceBaseRenderingTechnique {
  render(scene: Scene): void;
}

export abstract class BaseRenderingTechnique implements InterfaceBaseRenderingTechnique {
  protected canvas: HTMLCanvasElement;

  protected config: Config;

  protected constructor(canvas: HTMLCanvasElement, config: Config) {
    this.canvas = canvas;
    this.config = config;

    this.canvas.width = config.dimensions.width;
    this.canvas.height = config.dimensions.height;
  }

  abstract render(scene: Scene): void;
}
