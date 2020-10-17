import type { TimeService } from '@/krittengine/controller/time.service';
import type { InputService } from '@/krittengine/controller/input.service';

export type IDEntity = string;

export type ParamsEntity = {
  id?: IDEntity;
};

export type SerializedEntity = {
  id: IDEntity;
};

export interface InterfaceEntity {
  readonly id: IDEntity;

  hookUpdate(data: { TimeService: typeof TimeService; InputService: typeof InputService }): void;
  serialize(): SerializedEntity;
}
