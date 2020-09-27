import { Scene } from '@/krittengine/model/scene';
import { ConfigKrittengineInitial } from '@/krittengine/controller/krittengine.types';

export interface InterfaceBaseRenderingTechnique {
  render(scene: Scene): void;
}

export abstract class BaseRenderingTechnique implements InterfaceBaseRenderingTechnique {
  protected canvas: HTMLCanvasElement;

  protected config: ConfigKrittengineInitial;

  protected constructor(canvas: HTMLCanvasElement, config: ConfigKrittengineInitial) {
    this.canvas = canvas;
    this.config = config;

    this.canvas.width = config.dimensions.width;
    this.canvas.height = config.dimensions.height;
  }

  abstract render(scene: Scene): void;
}
