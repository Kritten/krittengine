import { BaseRenderingTechnique } from '@/krittengine/view/renderingTechnique/base.renderingTechnique';
import { RaytracerRenderingTechnique } from '@/krittengine/view/renderingTechnique/raytracer.renderingTechnique';
import { merge } from 'lodash';
import { ConfigKrittengine, ConfigKrittengineInitial, NameRenderingTechnique } from '@/krittengine/controller/krittengine.types';
import { SceneBuilder } from '@/sceneBuilder/sceneBuilder';
import { TimeService } from '@/krittengine/controller/time.service';

export interface InterfaceKrittengine {
  start(config: ConfigKrittengine): void;
  stop(): void;
  continue(): void;
  updateConfig(config: ConfigKrittengine): void;
  getSceneBuilder(): SceneBuilder;
}

export class Krittengine implements InterfaceKrittengine {
  private idAnimation: number;

  private config: ConfigKrittengine = {
    loop: true,
    renderingTechnique: 'raytracer',
    dimensions: { width: 100, height: 100 },
  };

  private readonly renderingTechniques: { [key in NameRenderingTechnique]: BaseRenderingTechnique };

  private activeRenderingTechnique: BaseRenderingTechnique;

  private readonly sceneBuilder: SceneBuilder;

  constructor(canvas: HTMLCanvasElement, config: ConfigKrittengineInitial = {}) {
    this.config = merge(this.config, config);

    this.renderingTechniques = { raytracer: new RaytracerRenderingTechnique(canvas, this.config) };

    this.activeRenderingTechnique = this.renderingTechniques.raytracer;

    this.sceneBuilder = new SceneBuilder();
  }

  start(config: ConfigKrittengine = {}) {
    if (this.sceneBuilder.getScenes().size === 0) {
      throw Error('At least on scene is required');
    }

    this.config = merge(this.config, config);

    const { loop = true } = this.config;

    TimeService.init();

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

  updateConfig(config: ConfigKrittengine) {
    if (config.loop !== undefined) {
      throw Error('not implemented');
    }

    if (config.renderingTechnique !== undefined) {
      this.activeRenderingTechnique = this.renderingTechniques[config.renderingTechnique];
    }

    this.config = merge(this.config, config);
  }

  getSceneBuilder() {
    return this.sceneBuilder;
  }

  private updateLoop(timestamp: DOMHighResTimeStamp = 0) {
    this.update(timestamp);
    this.idAnimation = window.requestAnimationFrame(this.updateLoop.bind(this));
  }

  private update(timestamp: DOMHighResTimeStamp = 0) {
    TimeService.update(timestamp);

    this.activeRenderingTechnique.render(this.sceneBuilder.getActiveScene());
  }
}
