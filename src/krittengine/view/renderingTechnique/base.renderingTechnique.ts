import { Scene } from '@/krittengine/model/scene';

export interface InterfaceBaseRenderingTechnique {
  render(scene: Scene): Promise<void>;
  screenResized(): void;
}

export abstract class BaseRenderingTechnique implements InterfaceBaseRenderingTechnique {
  abstract render(scene: Scene): Promise<void>;

  abstract screenResized(): void;
}
