import { BaseRenderingTechnique, InterfaceBaseRenderingTechnique } from '@/krittengine/view/renderingTechnique/base.renderingTechnique';
import { Scene } from '@/krittengine/model/scene';
import { ConfigKrittengine } from '@/krittengine/controller/krittengine.types';
import { mat4, vec3 } from 'gl-matrix';
import { Ray } from '@/krittengine/model/ray';

export class RaytracerRenderingTechnique extends BaseRenderingTechnique implements InterfaceBaseRenderingTechnique {
  private context: CanvasRenderingContext2D;

  private readonly imageData: ImageData;

  private pixelPerUnit = 1;

  private readonly mapUVCoordsToPixels = (value: number, y1: number) => (value * 2) / y1 - 1;

  constructor(canvas: HTMLCanvasElement, config: ConfigKrittengine) {
    super(canvas, config);

    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    // this.imageData = this.context.createImageData(this.canvas.width, this.canvas.height);
    this.imageData = new ImageData(config.dimensions.width, config.dimensions.height);
  }

  render(scene: Scene): void {
    const camera = scene.getActiveCamera();

    camera.updateAspectRatio(this.canvas.width / this.canvas.height);

    const inverseProjectionMatrix = mat4.invert(mat4.create(), camera.matrixPerspective);
    const inverseMatrixView = mat4.invert(mat4.create(), camera.matrixView);

    const widthValues: { [key: number]: number } = {};
    const bar = 1 / this.pixelPerUnit;

    let widthSpace = -(((this.canvas.width - 1) * 0.5) / this.pixelPerUnit - bar);
    // console.log(heightSpace, 'heightSpace');
    // console.log(widthSpace, 'widthSpace');

    const widthCanvasMinusOne = this.canvas.width - 1;
    const heightCanvasMinusOne = this.canvas.height - 1;

    // const start = performance.now();
    (async () => {
      for (let indexHeight = 0; indexHeight < this.canvas.height; indexHeight += 1) {
        // console.warn('###################################');

        for (let indexWidth = 0; indexWidth < this.canvas.width; indexWidth += 1) {
          let widthSpaceLocal = widthValues[indexWidth];
          if (widthSpaceLocal === undefined) {
            widthSpace += bar;
            widthValues[indexWidth] = widthSpace;
            widthSpaceLocal = widthSpace;
          }
          // console.log('############################');

          const pixelVector = vec3.fromValues(
            this.mapUVCoordsToPixels(indexWidth, widthCanvasMinusOne),
            -this.mapUVCoordsToPixels(indexHeight, heightCanvasMinusOne),
            // 2.0 * ((indexWidth + 0.5) / this.canvas.width) - 1.0,
            // 2.0 * ((indexHeight + 0.5) / this.canvas.height) - 1.0,
            1,
          );
          // console.log(pixelVector, 'pixelVector');
          const pixelViewSpace = vec3.transformMat4(vec3.create(), pixelVector, inverseProjectionMatrix);
          // console.log(pixelViewSpace, 'screenSpace');
          // const pixelWorldSpace = vec3.transformMat4(vec3.create(), pixelViewSpace, camera.matrixView);
          const pixelWorldSpace = vec3.transformMat4(vec3.create(), pixelViewSpace, inverseMatrixView);
          // console.log(pixelWorldSpace, 'pixelWorldSpace');

          // console.log(positionPixelObjectSpace, 'positionPixelObjectSpace');
          // console.log(positionPixelWorldSpace, 'positionPixelWorldSpace');

          // const directionCameraToPixel = vec3.normalize(vec3.create(), vec3.subtract(vec3.create(), positionPixelWorldSpace, camera.position));
          // console.log(directionCameraToPixel, 'directionCameraToPixel');
          // const cross = vec3.cross(vec3.create());

          // const lookAt = mat4.lookAt(mat4.create(), camera.position, positionPixelWorldSpace, vec3.fromValues(0, 1, 0));
          // const lookAt = mat4.targetTo(DUMMY_MAT4, camera.position, pixelWorldSpace, VECTOR_UP);
          // // console.log(lookAt, 'lookAt');
          // const rotation = mat4.getRotation(quat.create(), lookAt);
          // console.log(rotation, 'rotation');

          // const axis = vec3.create();
          // console.log(quat.getAxisAngle(axis, rotation), 'rotation');
          // console.log(axis, 'axis');

          // camera.rotation;

          const ray = new Ray({
            position: camera.position,
            // rotation,
            direction: pixelWorldSpace,
          });
          // console.log(ray, 'ray');

          const intersected = this.intersectWithScene(ray, scene);

          const index = (this.canvas.width * indexHeight + indexWidth) * 4;
          if (intersected) {
            this.imageData.data[index] = 255;
            this.imageData.data[index + 1] = 0;
            this.imageData.data[index + 2] = 0;
            this.imageData.data[index + 3] = 255;
          } else {
            this.imageData.data[index] = 0;
            this.imageData.data[index + 1] = 0;
            this.imageData.data[index + 2] = 0;
            this.imageData.data[index + 3] = 255;
          }
          // console.log(widthSpaceLocal);
          // await new Promise((resolve) => {
          //   setTimeout(() => {
          //     resolve();
          //   }, 0);
          // });
        }
      }
    })();
    // const endRaytracing = performance.now();
    // eslint-disable-next-line no-console
    // console.warn(endRaytracing - start, 'raytracing');
    this.context.putImageData(this.imageData, 0, 0);
  }

  // eslint-disable-next-line class-methods-use-this
  intersectWithScene(ray: Ray, scene: Scene): boolean {
    // TODO: direction ray kann vorberechnet werden
    // const directionRay = vec3.transformQuat(vec3.create(), this.directionRayInitial, ray.rotation);
    // vec3.normalize(directionRay, directionRay);

    // eslint-disable-next-line no-console
    // console.log(scene, 'scene');
    for (const [, object] of scene.getObjects()) {
      if (object.intersectsWithRay(ray)) {
        return true;
      }
    }

    return false;
  }
}
