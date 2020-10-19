import type { SerializedScene } from '@/krittengine/model/scene.types';
import type { Dimensions } from '@/krittengine/controller/krittengine.types';

export type DataEventWorkerRaytracer = {
  scene: SerializedScene;
  dimensionsCanvas: Dimensions;
  infoWorker: { numberOfLines: number; offset: number };
};

export type ResponseEventWorkerRaytracer = {
  result: number[];
};

export type ResultEventWorkerRaytracer = {
  result: ResponseEventWorkerRaytracer;
  infoWorker: { numberOfLines: number; offset: number };
};
