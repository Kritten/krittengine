import { BaseRenderingTechnique, InterfaceBaseRenderingTechnique } from '@/krittengine/view/renderingTechnique/base.renderingTechnique';
import { Scene } from '@/krittengine/model/scene';
import { CanvasService } from '@/krittengine/controller/canvas.service';
import { WorkerService } from '@/krittengine/controller/worker.service';
import { vec3, vec4 } from 'gl-matrix';
import { intersectWithScene } from '@/krittengine/view/renderingTechnique/raytracer/raytracer.helpers';
import { Ray } from '@/krittengine/model/ray';
import { mapUVCoordsToPixels } from '@/krittengine/controller/helpers';

export class RaytracerRenderingTechnique extends BaseRenderingTechnique implements InterfaceBaseRenderingTechnique {
  private context: CanvasRenderingContext2D;

  private imageData: ImageData;

  print = true;

  constructor() {
    super();

    this.context = CanvasService.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.imageData = new ImageData(CanvasService.canvas.width, CanvasService.canvas.height);

    WorkerService.initWorkersRaytracer({ countWorkers: 1 });
  }

  async render(scene: Scene): Promise<void> {
    const start = performance.now();

    const times = {
      total: -1,
      serializing: -1,
      rendering: -1,
      collecting: -1,
      setImageData: -1,
    };

    const startSerializing = performance.now();
    const serializedScene = scene.serialize();
    times.serializing = performance.now() - startSerializing;
    // console.log(performance.now() - startSerializing, 'performance.now() - startSerializing');

    const startRendering = performance.now();
    const resultWorkers = await Promise.all(
      WorkerService.runWorkersRaytracer({
        message: {
          scene: serializedScene,
          dimensionsCanvas: {
            width: CanvasService.canvas.width,
            height: CanvasService.canvas.height,
          },
        },
      }),
    );
    times.rendering = performance.now() - startRendering;

    const startCollecting = performance.now();
    let result: number[] = [];
    for (let i = 0; i < resultWorkers.length; i += 1) {
      const resultWorker = resultWorkers[i];

      result = result.concat(resultWorker.result.result);
      // const offset = resultWorker.infoWorker.offset * CanvasService.canvas.width * 4;
      // this.imageData.data.set(resultWorker.result.result, offset);
    }
    times.collecting = performance.now() - startCollecting;

    const startSetImageData = performance.now();
    // this.imageData.data.set(result);
    this.imageData.data.set(result);
    times.setImageData = performance.now() - startSetImageData;

    // this.renderOnMainThread(scene);

    if (this.print) {
      // eslint-disable-next-line no-console
      console.group(`Rendered in ${performance.now() - start}`);
      // eslint-disable-next-line no-console
      console.log('serializing', times.serializing);
      // eslint-disable-next-line no-console
      console.log('rendering', times.rendering);
      // eslint-disable-next-line no-console
      console.log('collecting', times.collecting);
      // eslint-disable-next-line no-console
      console.log('setImageData', times.setImageData);
      // eslint-disable-next-line no-console
      console.groupEnd();
    }

    this.context.putImageData(this.imageData, 0, 0);
  }

  screenResized(): void {
    this.imageData = new ImageData(CanvasService.canvas.width, CanvasService.canvas.height);
  }

  private renderOnMainThread(scene: Scene) {
    const camera = scene.activeCamera;

    // let numberOfProcessedPixels = 0;
    // const sizeChunkPixels = CanvasService.numberOfPixels / 20.0;

    for (let indexHeight = 0; indexHeight < CanvasService.canvas.height; indexHeight += 1) {
      // console.warn('###################################');

      for (let indexWidth = 0; indexWidth < CanvasService.canvas.width; indexWidth += 1) {
        const pixelVector = vec3.fromValues(
          mapUVCoordsToPixels(indexWidth, CanvasService.canvas.width - 1),
          -mapUVCoordsToPixels(indexHeight, CanvasService.canvas.height - 1),
          // 2.0 * ((indexWidth + 0.5) / this.canvas.width) - 1.0,
          // 2.0 * ((indexHeight + 0.5) / this.canvas.height) - 1.0,
          1,
        );
        // console.log(pixelVector, 'pixelVector');
        const pixelViewSpace = vec3.transformMat4(vec3.create(), pixelVector, camera.matrixPerspectiveInverse);
        // console.log(pixelViewSpace, 'screenSpace');

        const cameraPositionViewSpace = vec3.transformMat4(vec3.create(), camera.position, camera.matrixView);

        const direction = vec3.subtract(vec3.create(), pixelViewSpace, cameraPositionViewSpace);
        // const direction = vec3.subtract(vec3.create(), pixelWorldSpace, camera.position);
        vec3.normalize(direction, direction);
        // console.log(direction, 'direction');
        const rayViewSpace = new Ray({
          position: cameraPositionViewSpace,
          direction,
        });

        const color = intersectWithScene(rayViewSpace, scene);

        vec4.scale(color, color, 255);

        const index = (CanvasService.canvas.width * indexHeight + indexWidth) * 4;
        [this.imageData.data[index], this.imageData.data[index + 1], this.imageData.data[index + 2], this.imageData.data[index + 3]] = color;

        // numberOfProcessedPixels += 1;
        // if (numberOfProcessedPixels % sizeChunkPixels === 0) {
        //   const now = performance.now();
        //   const time = ((now - start) * 0.001).toFixed(2);
        //   const percentage = ((numberOfProcessedPixels / CanvasService.numberOfPixels) * 100).toFixed(2);
        //   // eslint-disable-next-line no-console
        //   // console.log(`Process: ${percentage}% (${time}s)`);
        // }
      }
    }
  }
}
