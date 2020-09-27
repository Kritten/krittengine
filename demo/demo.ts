const krittengine = new window.Krittengine(document.getElementById('canvas') as HTMLCanvasElement, { dimensions: { width: 100, height: 50 } });
// @ts-ignore
window.krittengine = krittengine;

const sceneBuilder = krittengine.getSceneBuilder();

const scene = sceneBuilder.createScene('default');
const camera = sceneBuilder.createCamera('camera');

scene.addCamera(camera);

// console.log(scene, 'scene');
// console.log(camera, 'camera');

krittengine.start({ loop: false });

// setTimeout(() => {
//   // eslint-disable-next-line no-console
//   console.log('stopping');
//   krittengine.stop();
// }, 500);

// setTimeout(() => {
//   console.log('continue');
//   krittengine.continue();
// }, 3000);
