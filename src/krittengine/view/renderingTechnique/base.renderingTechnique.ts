import { Scene } from '@/krittengine/model/scene';

export interface InterfaceBaseRenderingTechnique {
  render(scene: Scene): void;
  screenResized(): void;
}

export abstract class BaseRenderingTechnique implements InterfaceBaseRenderingTechnique {
  abstract render(scene: Scene): void;

  abstract screenResized(): void;
}
