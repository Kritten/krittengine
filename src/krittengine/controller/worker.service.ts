import WorkerRaytracer from '@/workers/raytracer.worker';
import { DataEventWorkerRaytracer, ResponseEventWorkerRaytracer, ResultEventWorkerRaytracer } from '@/workers/raytracer.worker.types';

type ParamsInitWorkers = {
  countWorkers?: number;
};

type ParamsRunWorkers = {
  message: Omit<DataEventWorkerRaytracer, 'infoWorker'>;
};

interface InterfaceWorkerService {
  initWorkersRaytracer(params: ParamsInitWorkers): void;
  runWorkersRaytracer(params: ParamsRunWorkers): Promise<ResultEventWorkerRaytracer>[];
}

class WorkerServiceClass implements InterfaceWorkerService {
  readonly numberOfWorkersMax = window.navigator.hardwareConcurrency;

  workersRaytracer: WorkerRaytracer[];

  // workersRaytracerResults: Promise<unknown>[];

  initWorkersRaytracer({ countWorkers = this.numberOfWorkersMax }: ParamsInitWorkers = {}): void {
    if (this.workersRaytracer !== undefined) {
      throw Error('already initialized');
    }

    this.workersRaytracer = [];

    const countWorkersFinal = Math.min(countWorkers, this.numberOfWorkersMax);

    for (let i = 0; i < countWorkersFinal; i += 1) {
      const worker = new WorkerRaytracer();
      // worker.onmessage = (e) => {
      //   this.workersRaytracerResults[i] = e.data;
      //   console.warn(e, 'received');
      // };
      this.workersRaytracer.push(worker);
    }
  }

  runWorkersRaytracer(params: ParamsRunWorkers): Promise<ResultEventWorkerRaytracer>[] {
    const result: Promise<ResultEventWorkerRaytracer>[] = [];

    const numberOfLinesPerWorker = Math.ceil(params.message.dimensionsCanvas.height / this.workersRaytracer.length);

    const offsetForWorkers = [];
    let currentOffsetForWorker = 0;

    while (currentOffsetForWorker < params.message.dimensionsCanvas.height) {
      offsetForWorkers.push(currentOffsetForWorker);
      currentOffsetForWorker += numberOfLinesPerWorker;
    }

    // console.log(offsetForWorkers, 'offsetForWorker');
    //
    // console.log(numberOfLinesPerWorker, 'numberOfLinesPerWorker');

    const maxWorkers = Math.min(offsetForWorkers.length, this.workersRaytracer.length);

    for (let i = 0; i < maxWorkers; i += 1) {
      const worker = this.workersRaytracer[i];

      const infoWorker = {
        id: i,
        numberOfLines: numberOfLinesPerWorker,
        offset: offsetForWorkers[i],
      };

      const promise = new Promise<ResultEventWorkerRaytracer>((resolve) => {
        worker.onmessage = (e: MessageEvent<ResponseEventWorkerRaytracer>) => {
          resolve({
            result: e.data,
            infoWorker,
          });
        };
      });

      // if (i === 0) {
      worker.postMessage({
        ...params.message,
        infoWorker,
      } as DataEventWorkerRaytracer);

      result.push(promise);
      // }
    }

    return result;
  }
}

export const WorkerService = new WorkerServiceClass();
