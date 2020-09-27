import { BaseRenderingTechnique, InterfaceBaseRenderingTechnique } from '@/krittengine/view/renderingTechnique/base.renderingTechnique';
import { Scene } from '@/krittengine/model/scene';
import { ConfigKrittengineInitial } from '@/krittengine/controller/krittengine.types';
import { mat4, quat, vec3 } from 'gl-matrix';
import { Ray } from '@/krittengine/model/ray';
import { Sphere } from '@/krittengine/model/shapes/sphere';

export interface InterfaceRaytracerTechnique extends InterfaceBaseRenderingTechnique {}

export class RaytracerRenderingTechnique extends BaseRenderingTechnique implements InterfaceRaytracerTechnique {
  private context: CanvasRenderingContext2D;

  private readonly imageData: ImageData;

  private pixelPerUnit = 9;

  constructor(canvas: HTMLCanvasElement, config: ConfigKrittengineInitial) {
    super(canvas, config);

    this.context = this.canvas.getContext('2d');
    // this.imageData = this.context.createImageData(this.canvas.width, this.canvas.height);
    this.imageData = this.context.createImageData(1, 1);
  }

  render(scene: Scene): void {
    // eslint-disable-next-line no-console
    // console.log(scene, 'scene');
    const camera = scene.getActiveCamera();

    // let quat_x = quat.setAxisAngle(quat.create(), vec3.fromValues(1.0, 0.0, 0.0), glMatrix.toRadian(360));
    /**
     * Rotation
     */
    camera.position = vec3.fromValues(0, 0, 2);
    // let quatX = quat.create();
    // let quatY = quat.create();
    // let quatY = quat.setAxisAngle(quat.create(), vec3.fromValues(0.0, 1.0, 0.0), glMatrix.toRadian(0));

    // quat.multiply(quatX, quatY, quatX);
    // quat.normalize(camera.rotation, quatX);
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
    const planeTransformation = mat4.translate(mat4.create(), camera.matrixTransformation, vec3.fromValues(0.0, 0.0, -2));
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
    let widthSpace = -((this.canvas.width - 1) * 0.5) / this.pixelPerUnit - bar;

    const start = performance.now();
    (async () => {
      for (let indexHeight = 0; indexHeight < this.canvas.height; indexHeight += 1) {
        heightSpace -= bar;

        for (let indexWidth = 0; indexWidth < this.canvas.width; indexWidth += 1) {
          let widthSpaceLocal = widthValues[indexWidth];
          if (widthSpaceLocal === undefined) {
            widthSpace += bar;
            widthValues[indexWidth] = widthSpace;
            widthSpaceLocal = widthSpace;
          }

          const positionPixelObjectSpace = vec3.fromValues(widthSpaceLocal, heightSpace, 0);
          // console.log(positionPixelObjectSpace, 'positionPixelObjectSpace');

          const positionPixelWorldSpace = vec3.transformMat4(vec3.create(), positionPixelObjectSpace, planeTransformation);
          // console.log(positionPixelWorldSpace, 'positionPixelWorldSpace');

          // const directionCameraToPixel = vec3.normalize(vec3.create(), vec3.subtract(vec3.create(), positionPixelWorldSpace, camera.position));
          // console.log(directionCameraToPixel, 'directionCameraToPixel');
          // const cross = vec3.cross(vec3.create());

          // const lookAt = mat4.lookAt(mat4.create(), camera.position, positionPixelWorldSpace, vec3.fromValues(0, 1, 0));
          const lookAt = mat4.targetTo(mat4.create(), camera.position, positionPixelWorldSpace, vec3.fromValues(0, 1, 0));
          // console.log(lookAt, 'lookAt');
          const rotation = mat4.getRotation(quat.create(), lookAt);
          // console.log(rotation, 'rotation');

          // const axis = vec3.create();
          // console.log(quat.getAxisAngle(axis, rotation), 'rotation');
          // console.log(axis, 'axis');

          // camera.rotation;

          const ray = new Ray({ position: camera.position, rotation });
          // console.log(ray, 'ray');

          const intersected = this.intersect(ray, scene);
          // console.warn(intersected, 'intersected');

          if (intersected) {
            this.imageData.data[0] = 0;
            this.imageData.data[1] = 255;
            this.imageData.data[2] = 0;
            this.imageData.data[3] = 255;
          } else {
            this.imageData.data[0] = 255;
            this.imageData.data[1] = 0;
            this.imageData.data[2] = 0;
            this.imageData.data[3] = 255;
          }
          // console.log(widthSpaceLocal);
          this.context.putImageData(this.imageData, indexWidth, indexHeight);
          // await new Promise((resolve) => {
          //   setTimeout(() => {
          //     resolve();
          //   }, 0);
          // });
        }
      }
    })();
    // eslint-disable-next-line no-console
    console.warn(performance.now() - start, 'performance.now() - start');
  }

  // eslint-disable-next-line class-methods-use-this
  intersect(ray: Ray, scene: Scene): boolean {
    // eslint-disable-next-line no-console
    console.log(scene, 'scene');
    const sphere1 = new Sphere({ position: vec3.fromValues(0, 4, -6), radius: 2 });
    const sphere2 = new Sphere({ position: vec3.fromValues(0, 0, -3) });
    const sphere3 = new Sphere({ position: vec3.fromValues(-9, 0, -2), radius: 2 });
    const arr = [sphere1, sphere2, sphere3];

    for (let i = 0; i < arr.length; i += 1) {
      const sphere = arr[i];
      // console.log(sphere, 'sphere');

      const directionRay = vec3.transformQuat(vec3.create(), vec3.fromValues(0, 0, -1), ray.rotation);
      // console.log(directionRay, 'directionRay');
      vec3.normalize(directionRay, directionRay);

      const sphereToRayOrigin = vec3.subtract(vec3.create(), ray.position, sphere.position);
      const rayOriginToSphere = vec3.subtract(vec3.create(), sphere.position, ray.position);
      // console.log(rayOriginToSphere, 'rayOriginToSphere');
      // console.log(directionRay, 'directionRay');
      const t = vec3.dot(rayOriginToSphere, directionRay);
      // console.warn('######', t);
      const p = vec3.scaleAndAdd(vec3.create(), ray.position, directionRay, t);
      const y = vec3.len(vec3.subtract(vec3.create(), sphere.position, p));
      if (y <= sphere.radius) {
        return true;
        // const x = Math.sqrt(sphere.radius ** 2 - y ** 2);
        // const t1 = t - x;
        // const t2 = t + x;
      }

      const a = vec3.dot(directionRay, directionRay);
      const b = 2.0 * vec3.dot(sphereToRayOrigin, directionRay);
      const c = vec3.dot(sphereToRayOrigin, sphereToRayOrigin) - sphere.radius ** 2;

      const discriminant = b ** 2 - 4 * a * c;
      // console.warn(discriminant, 'discriminant');

      if (discriminant < 0) {
        // console.warn(-1, '+++++++++++++++++++++++++');
      } else {
        let numerator = -b - Math.sqrt(discriminant);
        if (numerator > 0) {
          // console.warn(numerator / (2.0 * a), '+++++++++++++++++++++++++');
          return true;
        }

        numerator = -b + Math.sqrt(discriminant);
        if (numerator > 0) {
          // console.warn(numerator / (2.0 * a), '+++++++++++++++++++++++++');
          return true;
        }

        // console.warn(-1, '+++++++++++++++++++++++++');
      }
    }
    return false;
  }
}
