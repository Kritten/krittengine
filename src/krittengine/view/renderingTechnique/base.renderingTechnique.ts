import { Scene } from '@/krittengine/model/scene';
import { ConfigKrittengine } from '@/krittengine/controller/krittengine.types';

export interface InterfaceBaseRenderingTechnique {
  render(scene: Scene): void;
}

export abstract class BaseRenderingTechnique implements InterfaceBaseRenderingTechnique {
  protected canvas: HTMLCanvasElement;

  protected config: ConfigKrittengine;

  protected constructor(canvas: HTMLCanvasElement, config: ConfigKrittengine) {
    this.canvas = canvas;
    this.config = config;

    this.canvas.width = config.dimensions.width;
    this.canvas.height = config.dimensions.height;
  }

  abstract render(scene: Scene): void;
}
