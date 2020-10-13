const KEYS = {
  A: 'KeyA',
  W: 'KeyW',
  S: 'KeyS',
  D: 'KeyD',
  Q: 'KeyQ',
  E: 'KeyE',
};

type KeyboardKeys = typeof KEYS;

class InputServiceClass {
  activeKeys: { [key: string]: boolean } = {};

  pressedKeys: { [key: string]: boolean } = {};

  KEYS: KeyboardKeys = KEYS;

  init(): void {
    this.initializeEvents();
  }

  private initializeEvents() {
    document.onkeydown = (event) => this.handleKeyDown(event);
    document.onkeyup = (event) => this.handleKeyUp(event);

    document.onpointerlockchange = (event) => this.handlePointerlockChange(event);
  }

  private handleKeyDown(event: KeyboardEvent) {
    this.activeKeys[event.code] = true;
  }

  private handleKeyUp(event: KeyboardEvent) {
    this.activeKeys[event.code] = false;
    this.pressedKeys[event.code] = true;
  }

  private handlePointerlockChange(event: Event) {
    // eslint-disable-next-line no-console
    console.log(event, 'event');
    // if (document.pointerLockElement === canvas || document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas) {
    //   console.log('mouse locked');
    //   canvas.addEventListener('mousemove', this.handle_mouse_move, false);
    // } else {
    //   console.log('mouse unlocked');
    //   // mouse_input.moved = false;
    //   canvas.removeEventListener('mousemove', this.handle_mouse_move, false);
    // }
  }
}

export const InputService = new InputServiceClass();
