import type { DataEventWorkerRaytracer } from '@/workers/raytracer.worker.types';
import { vec3, vec4 } from 'gl-matrix';
import { mapUVCoordsToPixels } from '@/krittengine/controller/helpers';
import { Scene } from '@/krittengine/model/scene';
import { Ray } from '@/krittengine/model/ray';
import { Camera } from '@/krittengine/model/camera';
import { intersectWithScene } from '@/krittengine/view/renderingTechnique/raytracer/raytracer.helpers';

// eslint-disable-next-line no-restricted-globals
const ctx: Worker = (self as unknown) as Worker;

// Post data to parent thread

// Respond to message from parent thread
ctx.addEventListener('message', (event: MessageEvent<DataEventWorkerRaytracer>) => {
  const start = performance.now();

  const times = {
    total: -1,
    deserializing: -1,
    rendering: -1,
  };

  const widthCanvas = event.data.dimensionsCanvas.width;
  const heightCanvas = event.data.dimensionsCanvas.height;
  const widthCanvasMinusOne = widthCanvas - 1;
  const heightCanvasMinusOne = heightCanvas - 1;

  const startDeserializing = performance.now();
  const scene = Scene.deserialize(event.data.scene);

  const camera = Camera.deserialize(event.data.scene.activeCamera);
  times.deserializing = performance.now() - startDeserializing;

  const result: number[] = [];

  // ctx.postMessage();
  // return;
  const maxHeight = Math.min(event.data.infoWorker.offset + event.data.infoWorker.numberOfLines, heightCanvas);
  // console.warn(event.data.infoWorker.offset, maxHeight, 'maxHeight');

  const startRendering = performance.now();
  for (let indexHeight = event.data.infoWorker.offset; indexHeight < maxHeight; indexHeight += 1) {
    // console.warn('###################################');

    for (let indexWidth = 0; indexWidth < widthCanvas; indexWidth += 1) {
      const pixelVector = vec3.fromValues(
        mapUVCoordsToPixels(indexWidth, widthCanvasMinusOne),
        -mapUVCoordsToPixels(indexHeight, heightCanvasMinusOne),
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

      result.push(...color);

      // const index = (widthCanvas * indexHeight + indexWidth) * 4;
      // [result[index], result[index + 1], result[index + 2], result[index + 3]] = color;

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
  times.rendering = performance.now() - startRendering;

  // if (this.print) {
  // eslint-disable-next-line no-console
  console.group(`Worker ${event.data.infoWorker.id}: Rendered in ${performance.now() - start}`);
  // eslint-disable-next-line no-console
  console.log(`Worker ${event.data.infoWorker.id}: deserializing`, times.deserializing);
  // eslint-disable-next-line no-console
  console.log(`Worker ${event.data.infoWorker.id}: rendering`, times.rendering);
  // eslint-disable-next-line no-console
  console.groupEnd();
  // }

  ctx.postMessage({ result });
});
