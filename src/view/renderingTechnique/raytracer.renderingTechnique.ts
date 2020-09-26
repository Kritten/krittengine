import { BaseRenderingTechnique, InterfaceBaseRenderingTechnique } from '@/view/renderingTechnique/base.renderingTechnique';
import { Scene } from '@/model/scene';
import { Config } from '@/controller/krittengine.types';

export interface InterfaceRaytracerTechnique extends InterfaceBaseRenderingTechnique {}

export class RaytracerRenderingTechnique extends BaseRenderingTechnique implements InterfaceRaytracerTechnique {
  private context: CanvasRenderingContext2D;

  private imageData: ImageData;

  constructor(canvas: HTMLCanvasElement, config: Config) {
    super(canvas, config);

    this.context = this.canvas.getContext('2d');
    // this.imageData = this.context.createImageData(this.canvas.width, this.canvas.height);
    this.imageData = this.context.createImageData(1, 1);
  }

  render(scene: Scene): void {
    // eslint-disable-next-line no-console
    console.log(scene, 'scene');
    (async () => {
      for (let indexHeight = 0; indexHeight < this.canvas.height; indexHeight += 1) {
        for (let indexWidth = 0; indexWidth < this.canvas.width; indexWidth += 1) {
          const value = 0;
          this.imageData.data[0] = value;
          this.imageData.data[1] = value;
          this.imageData.data[2] = value;
          this.imageData.data[3] = 255;
          this.context.putImageData(this.imageData, indexWidth, indexHeight);

          // await new Promise((resolve) => {
          //   setTimeout(() => {
          //     resolve();
          //   }, 100);
          // });
        }
      }
    })();
  }
}
