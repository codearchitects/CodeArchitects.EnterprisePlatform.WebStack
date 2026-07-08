import { MetadataHelpers } from '@ca-webstack/reflection';

export const ENTITYKEYS = 'keys';

export type KeysType = string | Array<string>;

export interface IEntityObject {
  name: string;
  keys: KeysType;
};

export function Entity(object: IEntityObject) {
  return MetadataHelpers.defineMetadata(ENTITYKEYS, object);
}

export function getEntity(object: any) {
  return MetadataHelpers.getMetadata<IEntityObject>(ENTITYKEYS, object);
}

export function hasEntity(object: any) {
  return MetadataHelpers.getMetadata<IEntityObject>(ENTITYKEYS, object) !== undefined;
}
