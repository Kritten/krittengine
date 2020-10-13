import { mean } from 'lodash';
import { glMatrix, quat, vec3 } from 'gl-matrix';

// const krittengine = new window.Krittengine(document.getElementById('canvas') as HTMLCanvasElement, { dimensions: { width: 3, height: 3 } });
// const krittengine = new window.Krittengine(document.getElementById('canvas') as HTMLCanvasElement, { dimensions: { width: 50, height: 100 } });
// const krittengine = new window.Krittengine(document.getElementById('canvas') as HTMLCanvasElement, { dimensions: { width: 300, height: 200 } });
const krittengine = new window.Krittengine(document.getElementById('canvas') as HTMLCanvasElement, { dimensions: { width: 100, height: 50 } });
// const krittengine = new window.Krittengine(document.getElementById('canvas') as HTMLCanvasElement, { dimensions: { width: 150, height: 100 } });
// const krittengine = new window.Krittengine(document.getElementById('canvas') as HTMLCanvasElement, { dimensions: { width: 1920, height: 1080 } });

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
camera.position = [0, 0, 0];

// let quat_x = quat.setAxisAngle(quat.create(), vec3.fromValues(1.0, 0.0, 0.0), glMatrix.toRadian(360));
// let quatX = quat.create();
// let quatY = quat.create();
const quatY = quat.setAxisAngle(quat.create(), vec3.fromValues(-1.0, 1.0, 0.0), glMatrix.toRadian(0));
// let quatY = quat.setAxisAngle(quat.create(), vec3.fromValues(1.0, 0.0, 0.0), glMatrix.toRadian(-TimeService.timeDeltaInSeconds));
// quat.multiply(quatX, quatY, quatX);
// quat.normalize(quatX, quatX);

quat.multiply(camera.rotation, camera.rotation, quatY);

// quat.normalize(camera.rotation, camera.rotation);
camera.updateMatrixTransformation();

camera.hookUpdate = function hookUpdate({ InputService, TimeService }) {
  const movementDirection = vec3.create();
  if (InputService.activeKeys[InputService.KEYS.W]) {
    // w
    vec3.add(movementDirection, movementDirection, vec3.fromValues(0.0, 0.0, -1));
    // vec3.add(this.m_position, this.m_position, vec3.fromValues(0.0, 0.0, -3 * this.glob_time_info.time_ratio))
  }
  if (InputService.activeKeys[InputService.KEYS.S]) {
    // s
    vec3.add(movementDirection, movementDirection, vec3.fromValues(0.0, 0.0, 1));
    // vec3.add(this.m_position, this.m_position, vec3.fromValues(0.0, 0.0, 3 * this.glob_time_info.time_ratio))
  }
  if (InputService.activeKeys[InputService.KEYS.A]) {
    // a
    vec3.add(movementDirection, movementDirection, vec3.fromValues(-1, 0.0, 0.0));
    // vec3.add(this.m_position, this.m_position, vec3.fromValues(-3.0 * this.glob_time_info.time_ratio, 0.0, 0.0))
  }
  if (InputService.activeKeys[InputService.KEYS.D]) {
    // d
    vec3.add(movementDirection, movementDirection, vec3.fromValues(1, 0.0, 0.0));
    // vec3.add(this.m_position, this.m_position, vec3.fromValues(3.0 * this.glob_time_info.time_ratio, 0.0, 0.0))
  }
  if (InputService.activeKeys[InputService.KEYS.Q]) {
    vec3.add(this.position, this.position, vec3.fromValues(0.0, 3.0 * TimeService.timeDeltaInSeconds, 0.0));
  }
  if (InputService.activeKeys[InputService.KEYS.E]) {
    vec3.add(this.position, this.position, vec3.fromValues(0.0, -3.0 * TimeService.timeDeltaInSeconds, 0.0));
  }

  // normalize vector for equal, view independent movement speed
  vec3.normalize(movementDirection, movementDirection);
  vec3.transformQuat(movementDirection, movementDirection, this.rotation);
  // scale the movement vector with the movement speed and the time.ratio
  movementDirection[1] = 0;
  vec3.normalize(movementDirection, movementDirection);
  vec3.scale(movementDirection, movementDirection, TimeService.timeDeltaInSeconds);
  // vec3.transformQuat(movement_direction, movement_direction, this.m_rotation);
  // add the resulting movement vector to the player_position
  vec3.add(this.position, this.position, movementDirection);
};
/**
 * Lights
 */
const light1 = sceneBuilder.createLight('light1');
light1.position = [0, 3, 4];
light1.color = [1.0, 1.0, 1.0];
const light2 = sceneBuilder.createLight('light2');
light2.position = [-500.0, 0.0, -5];
light2.color = [1.0, 1.0, 1.0];

light1.updateMatrixTransformation();
light2.updateMatrixTransformation();
/**
 * Material
 */
const material1 = sceneBuilder.createMaterial('material1');
// material1.coefficientAmbient = [1, 1, 1];
material1.coefficientAmbient = [0, 0.1, 0];
// material1.coefficientDiffuse = [0.1, 0.1, 0.1];
material1.coefficientDiffuse = [0, 1, 0];
// material1.specularFalloff = -1;
const material2 = sceneBuilder.createMaterial('material2');
material2.coefficientAmbient = [0.1, 0, 0];
material2.coefficientDiffuse = [1, 0, 0];
/**
 * Shapes
 */
const sphere1 = sceneBuilder.createSphere('sphere1');
sphere1.material = material1;
const sphere2 = sceneBuilder.createSphere('sphere2');
sphere2.material = material2;
const sphere3 = sceneBuilder.createSphere('sphere3');
sphere3.material = material1;

const box1 = sceneBuilder.createBox('box1');
box1.material = material1;

sphere1.position = [0, 0, -4];
// sphere1.scale = vec3.fromValues(2, 2, 2);
sphere2.position = [0, 0, -2];
sphere2.scale = vec3.fromValues(0.4, 0.4, 0.4);
sphere3.position = [3.0, 0.0, -5];
box1.position = [2, 0, -4];
// box1.scale = vec3.fromValues(1.4, 1.8, 1.4);
// box1.scale = vec3.fromValues(0.1, 0.1, 0.1);

sphere1.updateMatrixTransformation();
sphere2.updateMatrixTransformation();
sphere3.updateMatrixTransformation();
box1.updateMatrixTransformation();

// scene.addObject(sphere2);
scene.addObject(sphere1);
// scene.addObject(sphere3);
scene.addObject(box1);

scene.addCamera(camera);

scene.addLight(light1);
// scene.addLight(light2);

// console.log(scene, 'scene');
// console.log(camera, 'camera');

krittengine.addScene(scene);

// krittengine.start();
krittengine.start({ loop: false });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const benchmark = () => {
  const timings: number[] = [];
  const iterations = 100;
  for (let i = 0; i < iterations; i += 1) {
    const start = performance.now();
    krittengine.start({ loop: false });
    timings.push(performance.now() - start);
  }

  // eslint-disable-next-line no-console
  console.warn('mean', mean(timings));
};

// benchmark();

// setTimeout(() => {
//   // eslint-disable-next-line no-console
//   console.log('stopping');
//   krittengine.stop();
// }, 500);

// setTimeout(() => {
//   // console.log('continue');
//   krittengine.stop();
// }, 1000);

const buttonStartFullscreen = document.querySelector('button[data-onclick="enterFullscreen"]');
if (buttonStartFullscreen !== null) {
  buttonStartFullscreen.addEventListener('click', () => {
    krittengine.startFullscreen();
  });
}

const buttonLockMouse = document.querySelector('button[data-onclick="lockMouse"]');
if (buttonLockMouse !== null) {
  buttonLockMouse.addEventListener('click', () => {
    krittengine.lockMouse();
  });
}
