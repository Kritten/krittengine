const krittengine = new window.Krittengine(document.getElementById('canvas') as HTMLCanvasElement, { dimensions: { width: 300, height: 150 } });
// const krittengine = new window.Krittengine(document.getElementById('canvas') as HTMLCanvasElement, { dimensions: { width: 150, height: 100 } });

window.krittengine = krittengine;

const sceneBuilder = krittengine.getSceneBuilder();
/**
 * Scene
 */
const scene = sceneBuilder.createScene('default');
/**
 * Cameras
 */
const camera = sceneBuilder.createCamera('camera');
/**
 * Shapes
 */
const sphere1 = sceneBuilder.createSphere('sphere1');
const sphere2 = sceneBuilder.createSphere('sphere2');
const sphere3 = sceneBuilder.createSphere('sphere3');

sphere1.position = [0.0, 0.0, -5];
sphere2.position = [-3.0, 0.0, -5];
sphere3.position = [3.0, 0.0, -5];

scene.addObject(sphere1);
scene.addObject(sphere2);
scene.addObject(sphere3);

scene.addCamera(camera);

// console.log(scene, 'scene');
// console.log(camera, 'camera');

krittengine.addScene(scene);

// krittengine.start();
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
