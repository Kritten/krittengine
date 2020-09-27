import { IDEntity, ParamsEntity } from '@/krittengine/model/entity.types';

export abstract class Entity {
  readonly id: IDEntity;

  protected constructor({ id }: ParamsEntity = {}) {
    this.id = id;
  }
}
