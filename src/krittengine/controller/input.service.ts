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
  }

  private handleKeyDown(event: KeyboardEvent) {
    this.activeKeys[event.code] = true;
  }

  private handleKeyUp(event: KeyboardEvent) {
    this.activeKeys[event.code] = false;
    this.pressedKeys[event.code] = true;
  }
}

export const InputService = new InputServiceClass();
