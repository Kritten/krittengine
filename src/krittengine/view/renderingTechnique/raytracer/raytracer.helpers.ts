import { Ray } from '@/krittengine/model/ray';
import { Scene } from '@/krittengine/model/scene';
import { vec3, vec4 } from 'gl-matrix';
import { ShapeEntity } from '@/krittengine/model/shapes/shapeEntity';
import { InterfaceDataIntersection } from '@/krittengine/view/view.types';
import { transformDirectionWithMat4 } from '@/krittengine/controller/helpers';
import { Light } from '@/krittengine/model/light';
import { DUMMY_VEC3 } from '@/krittengine/controller/constants';

const computeShadingAmbient = (dataIntersection: InterfaceDataIntersection): vec3 => {
  return vec3.copy(vec3.create(), dataIntersection.material.coefficientAmbient);
};

const computeShadingDiffuse = (
  dataIntersection: InterfaceDataIntersection,
  dotNormalAndVectorToLight: number,
  light: Light,
  intensityLight: number,
): vec3 => {
  if (dotNormalAndVectorToLight > 0) {
    vec3.multiply(DUMMY_VEC3, dataIntersection.material.coefficientDiffuse, light.color);
    vec3.scale(DUMMY_VEC3, DUMMY_VEC3, intensityLight);
    return vec3.scale(DUMMY_VEC3, DUMMY_VEC3, dotNormalAndVectorToLight);
  }

  return [0, 0, 0];
};

const computeShadingSpecular = (
  dataIntersection: InterfaceDataIntersection,
  dotNormalAndVectorToLight: number,
  pointViewSpace: vec3,
  normalViewSpace: vec3,
  vectorToLightViewSpace: vec3,
  rayViewSpace: Ray,
  light: Light,
  intensityLight: number,
): vec3 => {
  if (dataIntersection.material.specularFalloff !== -1) {
    // DUMMY_VEC3
    const vectorReflect = vec3.subtract(DUMMY_VEC3, vec3.scale(DUMMY_VEC3, normalViewSpace, 2 * dotNormalAndVectorToLight), vectorToLightViewSpace);
    vec3.normalize(vectorReflect, vectorReflect);

    const vectorToCamera = vec3.subtract(vec3.create(), rayViewSpace.position, pointViewSpace);
    vec3.normalize(vectorToCamera, vectorToCamera);

    const foo = vec3.dot(vectorReflect, vectorToCamera);

    if (foo > 0) {
      // Todo: only metals have specular hightlights tinted with the material color
      // const bar = vec3.multiply(DUMMY_VEC3, dataIntersection.material.coefficientSpecular, light.color);
      const bar = vec3.scale(DUMMY_VEC3, light.color, intensityLight);
      return vec3.scale(DUMMY_VEC3, bar, foo ** dataIntersection.material.specularFalloff);
    }
  }
  return [0, 0, 0];
};

const computeShading = (rayViewSpace: Ray, dataIntersection: InterfaceDataIntersection, scene: Scene): vec4 => {
  const color = computeShadingAmbient(dataIntersection);

  const pointViewSpace = vec3.transformMat4(vec3.create(), dataIntersection.pointWorldSpace, scene.activeCamera.matrixView);
  const normalViewSpace = transformDirectionWithMat4(dataIntersection.normalWorldSpace, scene.activeCamera.matrixView);
  vec3.normalize(normalViewSpace, normalViewSpace);

  for (const [, light] of scene.lights) {
    const positionLightViewSpace = vec3.transformMat4(vec3.create(), light.position, scene.activeCamera.matrixView);
    const vectorToLightViewSpace = vec3.subtract(vec3.create(), positionLightViewSpace, pointViewSpace);
    // console.log(vectorToLightViewSpace, 'vectorToLightViewSpace');
    const distanceToLight = vec3.length(vectorToLightViewSpace);

    // TODO: skip if no effect
    const intensityLight = 1 / (light.intensityA * distanceToLight ** 2 + light.intensityB * distanceToLight + light.intensityC);

    vec3.normalize(vectorToLightViewSpace, vectorToLightViewSpace);
    const dotNormalAndVectorToLight = vec3.dot(normalViewSpace, vectorToLightViewSpace);
    // console.log(dataIntersection.normalWorldSpace, 'dataIntersection.normalWorldSpace');
    // console.log(vectorToLightViewSpace, 'vectorToLightViewSpace');

    vec3.add(color, color, computeShadingDiffuse(dataIntersection, dotNormalAndVectorToLight, light, intensityLight));

    vec3.add(
      color,
      color,
      computeShadingSpecular(
        dataIntersection,
        dotNormalAndVectorToLight,
        pointViewSpace,
        normalViewSpace,
        vectorToLightViewSpace,
        rayViewSpace,
        light,
        intensityLight,
      ),
    );
  }

  // return vec4.multiply(dataIntersection.color, dataIntersection.color, [effect, effect, effect, 1]);
  return [...color, 1] as vec4;
};

export const intersectWithScene = (rayViewSpace: Ray, scene: Scene, debug = false): vec4 => {
  // TODO: direction rayViewSpace kann vorberechnet werden
  // const directionRay = vec3.transformQuat(vec3.create(), this.directionRayInitial, rayViewSpace.rotation);
  // vec3.normalize(directionRay, directionRay);

  // eslint-disable-next-line no-console
  // console.log(scene, 'scene');
  let colorFinal: vec4 = [1, 0, 0, 1];

  const nearestObject: { object?: ShapeEntity; rayObjectSpace?: Ray; t: number } = { t: Infinity };

  for (const [, object] of scene.objects) {
    const rayWorldSpace = rayViewSpace.transform(scene.activeCamera.matrixViewInverse);
    const rayObjectSpace = rayWorldSpace.transform(object.matrixTransformationInverse);

    // if (this.print) {
    //   console.warn(rayViewSpace, 'rayViewSpace');
    //   console.log(rayObjectSpace, 'rayObjectSpace');
    // }

    const t = object.intersectsWithRay(rayObjectSpace, debug);
    if (t !== undefined && t < nearestObject.t) {
      nearestObject.object = object;
      nearestObject.rayObjectSpace = rayObjectSpace;
      nearestObject.t = t;
      // const pointViewSpace = vec3.transformMat4(vec3.create(), dataIntersectionNew.pointWorldSpace, scene.activeCamera.matrixView);
    }
  }

  if (nearestObject.object !== undefined) {
    const dataIntersection = nearestObject.object.getIntersectionData(nearestObject.rayObjectSpace as Ray, nearestObject.t);
    // console.log(dataIntersection, 'dataIntersection');
    colorFinal = computeShading(rayViewSpace, dataIntersection, scene);
  }

  return colorFinal;
};
