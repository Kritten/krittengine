import type { ConfigKrittengine } from '@/krittengine/controller/krittengine.types';

class CanvasServiceClass {
  canvas: HTMLCanvasElement;

  config: ConfigKrittengine;

  numberOfPixels = 0;

  isInFullscreen = false;

  hookFullscreenChange = () => {};

  init(canvas: HTMLCanvasElement, config: ConfigKrittengine): void {
    this.canvas = canvas;
    this.config = config;

    this.setDimensions(this.config.dimensions.width, this.config.dimensions.height);

    this.initializeEvents();
  }

  async startFullscreen() {
    // todo: set this.widthFullscreen + height here and use in event listener
    this.setDimensions(window.screen.width, window.screen.height);

    await this.canvas.requestFullscreen();
    // console.log(window.screen, 'window.screen');

    this.hookFullscreenChange();
  }

  lockMouse() {
    this.canvas.requestPointerLock();
  }

  async endFullscreen() {
    await window.document.exitFullscreen();
  }

  setDimensions(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;

    this.numberOfPixels = this.canvas.width * this.canvas.height;
  }

  private fullScreenChange() {
    this.setDimensions(this.config.dimensions.width, this.config.dimensions.height);

    this.hookFullscreenChange();
  }

  private initializeEvents() {
    document.onfullscreenchange = () => this.handleFullscreenChange();
  }

  private handleFullscreenChange() {
    this.isInFullscreen = window.document.fullscreenElement !== null;

    if (this.isInFullscreen) {
      // this.lockMouse();
      // console.log('fullscreen started');
    } else {
      this.fullScreenChange();
      // console.log('fullscreen ended');
    }
  }
}

export const CanvasService = new CanvasServiceClass();
