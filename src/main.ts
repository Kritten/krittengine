import { Krittengine } from '@/controller/krittengine';

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    Krittengine: typeof Krittengine;
  }
}

window.Krittengine = Krittengine;
