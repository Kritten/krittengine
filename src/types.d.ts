// types.d.ts
declare module '@/workers/raytracer.worker' {
  class WebpackWorker extends Worker {
    constructor();
  }

  export default WebpackWorker;
}
