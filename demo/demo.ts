const krittengine = new window.Krittengine(document.getElementById('canvas') as HTMLCanvasElement);
// @ts-ignore
window.krittengine = krittengine;

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
