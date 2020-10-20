import type { SerializedScene } from '@/krittengine/model/scene.types';
import type { Dimensions } from '@/krittengine/controller/krittengine.types';

type InfoWorker = {
  id: number;
  numberOfLines: number;
  offset: number;
};

export type DataEventWorkerRaytracer = {
  scene: SerializedScene;
  dimensionsCanvas: Dimensions;
  infoWorker: InfoWorker;
};

export type ResponseEventWorkerRaytracer = {
  result: number[];
};

export type ResultEventWorkerRaytracer = {
  result: ResponseEventWorkerRaytracer;
  infoWorker: InfoWorker;
};
