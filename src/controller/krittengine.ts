import { BaseRenderingTechnique } from '@/view/renderingTechnique/base.renderingTechnique';
import { RaytracerRenderingTechnique } from '@/view/renderingTechnique/raytracer.renderingTechnique';
import { merge } from 'lodash';
import { Scene } from '@/model/scene';
import { Config, NameRenderingTechnique } from '@/controller/krittengine.types';

export interface InterfaceKrittengine {
  start(config: Config): void;
  stop(): void;
  continue();
  updateConfig(config: Config);
}

export class Krittengine implements InterfaceKrittengine {
  private idAnimation: number;

  private config: Config = {
    loop: true,
    renderingTechnique: 'raytracer',
    dimensions: { width: 10, height: 10 },
  };

  private renderingTechniques: { [key in NameRenderingTechnique]: BaseRenderingTechnique };

  private activeRenderingTechnique: BaseRenderingTechnique;

  private activeScene: Scene;

  constructor(canvas: HTMLCanvasElement, config: Config = {}) {
    this.config = merge(this.config, config);

    this.renderingTechniques = { raytracer: new RaytracerRenderingTechnique(canvas, this.config) };

    this.activeRenderingTechnique = this.renderingTechniques.raytracer;
  }

  start(config: Config = {}) {
    this.config = merge(this.config, config);

    const { loop = true } = this.config;

    if (loop) {
      this.updateLoop();
    } else {
      this.update();
    }
  }

  stop() {
    window.cancelAnimationFrame(this.idAnimation);
  }

  continue() {
    this.start(this.config);
  }

  private updateLoop(timestamp: DOMHighResTimeStamp = 0) {
    this.update(timestamp);
    this.idAnimation = window.requestAnimationFrame(this.updateLoop.bind(this));
  }

  private update(timestamp: DOMHighResTimeStamp = 0) {
    // eslint-disable-next-line no-console
    console.log(timestamp, this.activeRenderingTechnique, 'this.activeRenderingTechnique');
    this.activeRenderingTechnique.render(this.activeScene);
  }

  updateConfig(config: Config) {
    if (config.loop !== undefined) {
      throw Error('not implemented');
    }

    if (config.renderingTechnique !== undefined) {
      this.activeRenderingTechnique = this.renderingTechniques[config.renderingTechnique];
    }

    this.config = merge(this.config, config);
  }
}
