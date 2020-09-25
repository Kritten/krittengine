import { Krittengine } from './controller/krittengine';

declare global {
  interface Window {
    Krittengine: typeof Krittengine;
  }
}

window.Krittengine = Krittengine;
