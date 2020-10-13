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
import * as Stats from 'stats.js';
import { InputService } from '@/krittengine/controller/input.service';
import { CanvasService } from '@/krittengine/controller/canvas.service';

// glMatrix.setMatrixArrayType(Array);

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

  private stats = new Stats();

  constructor(canvas: HTMLCanvasElement, config: ConfigKrittengineInitial = {}) {
    this.config = merge(this.config, config);

    CanvasService.init(canvas, this.config);

    this.renderingTechniques = { raytracer: new RaytracerRenderingTechnique() };

    this.activeRenderingTechnique = this.renderingTechniques.raytracer;

    this.sceneBuilder = new SceneBuilder();

    InputService.init();

    this.initStats();

    CanvasService.hookFullscreenChange = () => {
      this.screenResized();
    };
  }

  start(config: ConfigKrittengineInitial = {}): void {
    if (this.scenes.size === 0) {
      throw Error('At least on scene is required');
    }

    this.config = merge(this.config, config);

    const { loop = true } = this.config;

    this.updateCameras();

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

    if (config.dimensions !== undefined) {
      this.updateCameras();
    }

    this.config = merge(this.config, config);
  }

  getSceneBuilder(): SceneBuilder {
    return this.sceneBuilder;
  }

  private updateCameras() {
    for (const [, scene] of this.scenes) {
      for (const [, camera] of scene.cameras) {
        camera.updateAspectRatio();
      }
    }
  }

  private updateLoop(timestamp: DOMHighResTimeStamp = 0) {
    this.stats.begin();
    this.update(timestamp);
    this.stats.end();

    this.idAnimation = window.requestAnimationFrame(this.updateLoop.bind(this));
  }

  private update(timestamp: DOMHighResTimeStamp = 0) {
    TimeService.update(timestamp);
    // console.log(timestamp, 'timestamp');
    // console.log(TimeService.timeDelta, 'TimeService');
    // const start = performance.now();
    // for (let i = 0; i < 1000000000; i++) {
    //   const b = i ** i;
    //   const foo = b ** b;
    // }
    // console.log(performance.now() - start, 'performance.now() - end');

    this.activeScene.update();

    this.activeRenderingTechnique.render(this.activeScene);

    InputService.pressedKeys = {};

    // console.log(TimeService.timeDelta, 'TimeService');
  }

  addScene(scene: Scene): void {
    this.scenes.set(scene.id, scene);

    if (this.scenes.size === 1) {
      this.activeScene = scene;
    }
  }

  private initStats() {
    this.stats.showPanel(0);

    this.stats.dom.id = 'krittengine-stats';
    this.stats.dom.style.left = 'unset';
    this.stats.dom.style.right = '0';
    (this.stats.dom.childNodes[1] as HTMLCanvasElement).style.display = 'block';

    document.body.appendChild(this.stats.dom);
  }

  startFullscreen(): Promise<void> {
    return CanvasService.startFullscreen();
  }

  lockMouse(): void {
    CanvasService.lockMouse();
  }

  endFullscreen(): Promise<void> {
    return CanvasService.endFullscreen();
  }

  private screenResized() {
    this.updateCameras();
    this.activeRenderingTechnique.screenResized();
    // TODO: remove
    // this.activeRenderingTechnique.render(this.activeScene);
  }
}
