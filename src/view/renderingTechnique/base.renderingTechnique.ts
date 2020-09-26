// export interface BaseRenderingTechnique {
// }

export class BaseRenderingTechnique {
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }
}
