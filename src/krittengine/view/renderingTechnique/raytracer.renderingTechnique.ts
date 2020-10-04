import { BaseRenderingTechnique, InterfaceBaseRenderingTechnique } from '@/krittengine/view/renderingTechnique/base.renderingTechnique';
import { Scene } from '@/krittengine/model/scene';
import { ConfigKrittengine } from '@/krittengine/controller/krittengine.types';
import { mat4, vec3, vec4 } from 'gl-matrix';
import { Ray } from '@/krittengine/model/ray';
import { InterfaceDataIntersection } from '@/krittengine/view/view.types';
import { DUMMY_VEC3 } from '@/krittengine/controller/constants';
import { Light } from '@/krittengine/model/light';

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
    const camera = scene.activeCamera;

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

    const start = performance.now();
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

          const color = this.intersectWithScene(ray, scene);

          vec4.scale(color, color, 255);

          const index = (this.canvas.width * indexHeight + indexWidth) * 4;
          [this.imageData.data[index], this.imageData.data[index + 1], this.imageData.data[index + 2], this.imageData.data[index + 3]] = color;

          // this.imageData.data[index] = color[0];
          // this.imageData.data[index + 1] = color[1];
          // this.imageData.data[index + 2] = color[2];
          // this.imageData.data[index + 3] = color[3];

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
  private intersectWithScene(ray: Ray, scene: Scene): vec4 {
    // TODO: direction ray kann vorberechnet werden
    // const directionRay = vec3.transformQuat(vec3.create(), this.directionRayInitial, ray.rotation);
    // vec3.normalize(directionRay, directionRay);

    // eslint-disable-next-line no-console
    // console.log(scene, 'scene');
    let colorFinal: vec4 = [0, 0, 0, 1];

    for (const [, object] of scene.objects) {
      const dataIntersection = object.intersectsWithRay(ray);
      // console.log(dataIntersection, 'dataIntersection');
      if (dataIntersection !== false) {
        colorFinal = this.computeShading(ray, dataIntersection, scene);
      }
    }

    return colorFinal;
  }

  private computeShading(ray: Ray, dataIntersection: InterfaceDataIntersection, scene: Scene): vec4 {
    const color = this.computeShadingAmbient(dataIntersection);

    for (const [, light] of scene.lights) {
      const vectorToLight = vec3.subtract(vec3.create(), light.position, dataIntersection.point);
      // console.log(vectorToLight, 'vectorToLight');
      const distanceToLight = vec3.length(vectorToLight);

      const intensityLight = 1 / (light.intensityA * distanceToLight ** 2 + light.intensityB * distanceToLight + light.intensityC);
      // TODO: slip if no effect

      vec3.normalize(vectorToLight, vectorToLight);
      const dotNormalAndVectorToLight = vec3.dot(dataIntersection.normal, vectorToLight);

      vec3.add(color, color, this.computeShadingDiffuse(dataIntersection, dotNormalAndVectorToLight, light, intensityLight));

      vec3.add(
        color,
        color,
        this.computeShadingSpecular(dataIntersection, dotNormalAndVectorToLight, dataIntersection.normal, vectorToLight, ray, light, intensityLight),
      );
    }

    // return vec4.multiply(dataIntersection.color, dataIntersection.color, [effect, effect, effect, 1]);
    return [...color, 1] as vec4;
  }

  private computeShadingAmbient(dataIntersection: InterfaceDataIntersection): vec3 {
    return vec3.copy(vec3.create(), dataIntersection.material.coefficientAmbient);
  }

  private computeShadingDiffuse(
    dataIntersection: InterfaceDataIntersection,
    dotNormalAndVectorToLight: number,
    light: Light,
    intensityLight: number,
  ): vec3 {
    if (dotNormalAndVectorToLight > 0) {
      vec3.multiply(DUMMY_VEC3, dataIntersection.material.coefficientDiffuse, light.color);
      vec3.scale(DUMMY_VEC3, DUMMY_VEC3, intensityLight);
      return vec3.scale(DUMMY_VEC3, DUMMY_VEC3, dotNormalAndVectorToLight);
    }

    return [0, 0, 0];
  }

  private computeShadingSpecular(
    dataIntersection: InterfaceDataIntersection,
    dotNormalAndVectorToLight: number,
    normal: vec3,
    vectorToLight: vec3,
    ray: Ray,
    light: Light,
    intensityLight: number,
  ): vec3 {
    // DUMMY_VEC3
    const vectorReflect = vec3.subtract(DUMMY_VEC3, vec3.scale(DUMMY_VEC3, normal, 2 * dotNormalAndVectorToLight), vectorToLight);
    vec3.normalize(vectorReflect, vectorReflect);

    const vectorToCamera = vec3.subtract(vec3.create(), ray.position, dataIntersection.point);
    vec3.normalize(vectorToCamera, vectorToCamera);

    const foo = vec3.dot(vectorReflect, vectorToCamera);

    if (foo > 0) {
      // Todo: only metals have specular hightlights tinted with the material color
      // const bar = vec3.multiply(DUMMY_VEC3, dataIntersection.material.coefficientSpecular, light.color);
      const bar = vec3.scale(DUMMY_VEC3, light.color, intensityLight);
      return vec3.scale(DUMMY_VEC3, bar, foo ** dataIntersection.material.specularFalloff);
    }
    return [0, 0, 0];
  }
}
