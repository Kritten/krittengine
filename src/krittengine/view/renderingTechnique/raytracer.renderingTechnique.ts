import { BaseRenderingTechnique, InterfaceBaseRenderingTechnique } from '@/krittengine/view/renderingTechnique/base.renderingTechnique';
import { Scene } from '@/krittengine/model/scene';
import { ConfigKrittengine } from '@/krittengine/controller/krittengine.types';
import { glMatrix, mat4, quat, vec3 } from 'gl-matrix';
import { Ray } from '@/krittengine/model/ray';

export class RaytracerRenderingTechnique extends BaseRenderingTechnique implements InterfaceBaseRenderingTechnique {
  private context: CanvasRenderingContext2D;

  private readonly imageData: ImageData;

  private pixelPerUnit = 1;

  constructor(canvas: HTMLCanvasElement, config: ConfigKrittengine) {
    super(canvas, config);

    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    // this.imageData = this.context.createImageData(this.canvas.width, this.canvas.height);
    this.imageData = new ImageData(config.dimensions.width, config.dimensions.height);
  }

  render(scene: Scene): void {
    // eslint-disable-next-line no-console
    // console.log(scene, 'scene');
    // console.log(TimeService, 'timestamp');
    const camera = scene.getActiveCamera();

    camera.updateAspectRatio(this.canvas.width / this.canvas.height);

    // console.log(camera.matrixPerspective, 'camera.matrixPerspective');

    const inverseProjectionMatrix = mat4.invert(mat4.create(), camera.matrixPerspective);

    // let quat_x = quat.setAxisAngle(quat.create(), vec3.fromValues(1.0, 0.0, 0.0), glMatrix.toRadian(360));
    /**
     * Rotation
     */
    vec3.add(camera.position, camera.position, vec3.fromValues(0, 0, 0));
    // let quatX = quat.create();
    // let quatY = quat.create();
    const quatY = quat.setAxisAngle(quat.create(), vec3.fromValues(0.0, 1.0, 0.0), glMatrix.toRadian(0));
    // let quatY = quat.setAxisAngle(quat.create(), vec3.fromValues(1.0, 0.0, 0.0), glMatrix.toRadian(-TimeService.timeDeltaInSeconds));
    // quat.multiply(quatX, quatY, quatX);
    // quat.normalize(quatX, quatX);
    quat.multiply(camera.rotation, camera.rotation, quatY);
    // quat.normalize(camera.rotation, camera.rotation);
    // console.log(camera.rotation, 'camera.rotation');
    /**
     * Update transformation matrix
     */
    camera.updateMatrixTransformation();
    // console.log(camera.matrixTransformation, 'camera.matrixTransformation');
    // const rotation = mat4.getRotation(quat.create(), camera.matrixTransformation);
    // console.log(rotation, 'rotation');
    // const axis = vec3.create();
    // console.log(quat.getAxisAngle(axis, rotation), 'rotation');
    // console.log(axis, 'axis');

    // console.log(camera.viewingDirection, 'camera.viewingDirection');
    /**
     * Plane
     */
    const planeTransformation = mat4.translate(mat4.create(), camera.matrixTransformation, vec3.fromValues(0.0, 0.0, -5));
    // const planeTranslation = mat4.fromTranslation(mat4.create(), vec3.fromValues(0.0, 0.0, 2.0));

    // console.log(planeTransformation, 'planeTransformation');

    // const transformationMatrixPlane = mat4.multiply(mat4.create(), planeTransformation, camera.matrixTransformation);
    // console.log(transformationMatrixPlane, 'transformationMatrixPlane');

    // const distanceViewingPlaneWorldSpace = 1;
    // const directionWorldSpace = vec3.scale(vec3.create(), camera.viewingDirection, distanceViewingPlaneWorldSpace);
    // console.log(directionWorldSpace, 'directionWorldSpace');
    // const intersectionWithPlaneWorldSpace = vec3.add(vec3.create(), camera.position, directionWorldSpace);
    // console.log(intersectionWithPlaneWorldSpace, 'intersectionWithPlaneWorldSpace');

    // console.warn('#############');
    const widthValues: { [key: number]: number } = {};
    const bar = 1 / this.pixelPerUnit;

    let heightSpace = ((this.canvas.height - 1) * 0.5) / this.pixelPerUnit - bar;
    let widthSpace = -(((this.canvas.width - 1) * 0.5) / this.pixelPerUnit - bar);
    // console.log(heightSpace, 'heightSpace');
    // console.log(widthSpace, 'widthSpace');

    const upVector = vec3.fromValues(0, 1, 0);
    const dummyMat4 = mat4.create();

    const map = (value: number, x1: number, y1: number, x2: number, y2: number) => ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

    const start = performance.now();
    (async () => {
      for (let indexHeight = 0; indexHeight < this.canvas.height; indexHeight += 1) {
        heightSpace -= bar;
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
            map(indexWidth, 0, this.canvas.width - 1, -1, 1),
            -map(indexHeight, 0, this.canvas.height - 1, -1, 1),
            // 2.0 * ((indexWidth + 0.5) / this.canvas.width) - 1.0,
            // 2.0 * ((indexHeight + 0.5) / this.canvas.height) - 1.0,
            0.1,
          );
          // console.log(pixelVector, 'pixelVector');
          const pixelViewSpace = vec3.transformMat4(vec3.create(), pixelVector, inverseProjectionMatrix);
          // console.log(pixelViewSpace, 'screenSpace');
          // const pixelWorldSpace = vec3.transformMat4(vec3.create(), pixelViewSpace, camera.matrixView);
          const pixelWorldSpace = vec3.transformMat4(vec3.create(), pixelViewSpace, mat4.invert(mat4.create(), camera.matrixView));
          // console.log(pixelWorldSpace, 'pixelWorldSpace');

          const positionPixelObjectSpace = vec3.fromValues(widthSpaceLocal, heightSpace, 0);
          // console.log(positionPixelObjectSpace, 'positionPixelObjectSpace');
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const positionPixelWorldSpace = vec3.transformMat4(positionPixelObjectSpace, positionPixelObjectSpace, planeTransformation);
          // console.log(positionPixelWorldSpace, 'positionPixelWorldSpace');

          // const directionCameraToPixel = vec3.normalize(vec3.create(), vec3.subtract(vec3.create(), positionPixelWorldSpace, camera.position));
          // console.log(directionCameraToPixel, 'directionCameraToPixel');
          // const cross = vec3.cross(vec3.create());

          // const lookAt = mat4.lookAt(mat4.create(), camera.position, positionPixelWorldSpace, vec3.fromValues(0, 1, 0));
          const lookAt = mat4.targetTo(dummyMat4, camera.position, pixelWorldSpace, upVector);
          // console.log(lookAt, 'lookAt');
          const rotation = mat4.getRotation(quat.create(), lookAt);
          // console.log(rotation, 'rotation');

          // const axis = vec3.create();
          // console.log(quat.getAxisAngle(axis, rotation), 'rotation');
          // console.log(axis, 'axis');

          // camera.rotation;

          const ray = new Ray({
            position: camera.position,
            rotation,
          });
          // console.log(ray, 'ray');

          const intersected = this.intersect(ray, scene);

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
    const endRaytracing = performance.now();
    // eslint-disable-next-line no-console
    console.warn(endRaytracing - start, 'raytracing');
    this.context.putImageData(this.imageData, 0, 0);
  }

  // eslint-disable-next-line class-methods-use-this
  intersect(ray: Ray, scene: Scene): boolean {
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
