import { Krittengine } from '@/krittengine/controller/krittengine';

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    Krittengine: typeof Krittengine;
    krittengine: Krittengine;
  }
}
