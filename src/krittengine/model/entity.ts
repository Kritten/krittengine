import type { SerializedEntity, IDEntity, InterfaceEntity, ParamsEntity } from '@/krittengine/model/entity.types';
import { v4 } from 'uuid';
import { TimeService } from '@/krittengine/controller/time.service';
import { InputService } from '@/krittengine/controller/input.service';

export abstract class Entity implements InterfaceEntity {
  readonly id: IDEntity;

  protected constructor({ id }: ParamsEntity = {}) {
    if (id === undefined) {
      this.id = v4();
    } else {
      this.id = id;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hookUpdate(data: { TimeService: typeof TimeService; InputService: typeof InputService }): void {}

  serialize(): SerializedEntity {
    return {
      id: this.id,
    };
  }
}
