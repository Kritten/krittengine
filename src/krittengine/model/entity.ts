import { IDEntity, ParamsEntity } from '@/krittengine/model/entity.types';
import { v4 } from 'uuid';

export abstract class Entity {
  readonly id: IDEntity;

  protected constructor({ id }: ParamsEntity = {}) {
    if (id === undefined) {
      this.id = v4();
    } else {
      this.id = id;
    }
  }
}
