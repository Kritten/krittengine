import { mat4, vec3, vec4 } from 'gl-matrix';

export const map = (value: number, fromMin: number, fromMax: number, ToMin: number, ToMax: number): number =>
  ((value - fromMin) * (ToMax - ToMin)) / (fromMax - fromMin) + ToMin;

export const transformDirectionWithMat4 = (direction: vec3, matrix: mat4): vec3 => {
  return vec4.transformMat4(vec4.create(), [direction[0], direction[1], direction[2], 0], matrix).slice(0, 3) as vec3;
};
