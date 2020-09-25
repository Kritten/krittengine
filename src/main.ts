import { Krittengine } from './controller/krittengine';

declare global {
  interface Window {
    Krittengine: Krittengine;
  }
}

window.Krittengine = Krittengine;
