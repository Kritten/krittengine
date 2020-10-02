import { BaseRenderingTechnique } from '@/krittengine/view/renderingTechnique/base.renderingTechnique';
import { RaytracerRenderingTechnique } from '@/krittengine/view/renderingTechnique/raytracer.renderingTechnique';
import { merge } from 'lodash';
import {
  ConfigKrittengine,
  ConfigKrittengineInitial,
  InterfaceKrittengine,
  NameRenderingTechnique,
} from '@/krittengine/controller/krittengine.types';
import { SceneBuilder } from '@/sceneBuilder/sceneBuilder';
import { TimeService } from '@/krittengine/controller/time.service';
import { IDScene } from '@/krittengine/model/scene.types';
import { Scene } from '@/krittengine/model/scene';

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

  private scenes: Map<IDScene, Scene> = new Map();

  private activeScene: Scene;

  constructor(canvas: HTMLCanvasElement, config: ConfigKrittengineInitial = {}) {
    this.config = merge(this.config, config);

    this.renderingTechniques = { raytracer: new RaytracerRenderingTechnique(canvas, this.config) };

    this.activeRenderingTechnique = this.renderingTechniques.raytracer;

    this.sceneBuilder = new SceneBuilder();
  }

  start(config: ConfigKrittengineInitial = {}): void {
    if (this.scenes.size === 0) {
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

  stop(): void {
    window.cancelAnimationFrame(this.idAnimation);
  }

  continue(): void {
    this.start(this.config);
  }

  updateConfig(config: ConfigKrittengine): void {
    if (config.loop !== undefined) {
      throw Error('not implemented');
    }

    if (config.renderingTechnique !== undefined) {
      this.activeRenderingTechnique = this.renderingTechniques[config.renderingTechnique];
    }

    this.config = merge(this.config, config);
  }

  getSceneBuilder(): SceneBuilder {
    return this.sceneBuilder;
  }

  private updateLoop(timestamp: DOMHighResTimeStamp = 0) {
    this.update(timestamp);
    this.idAnimation = window.requestAnimationFrame(this.updateLoop.bind(this));
  }

  private update(timestamp: DOMHighResTimeStamp = 0) {
    TimeService.update(timestamp);

    this.activeRenderingTechnique.render(this.activeScene);
  }

  addScene(scene: Scene): void {
    this.scenes.set(scene.id, scene);

    if (this.scenes.size === 1) {
      this.activeScene = scene;
    }
  }
}
