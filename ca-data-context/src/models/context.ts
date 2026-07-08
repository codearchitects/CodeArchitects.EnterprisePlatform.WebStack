import { getEntity, hasEntity } from '../decorators';

export class Context {
  private context: Map<string, any>;

  constructor() {
    this.context = new Map<string, any>();
  }

  public contains<T>(object: T) {
    return this.context.has(this.getKey(object));
  }

  public get<T>(object: T) {
    return this.context.get(this.getKey(object));
  }

  public set<T>(object: T) {
    let key = this.getKey(object);
    if (key) {
      this.context.set(key, object);
    }
  }

  public remove<T>(object: T) {
    this.context.delete(this.getKey(object));
  }

  public clear() {
    this.context.clear();
  }

  public hasEntityDecorator<T>(object: T) {
    return hasEntity(object);
  }

  private getKey<T>(value: T) {
    let meta = getEntity(value);
    let keys = meta.keys;

    let key = this.isString(keys)
      ? this.generateKeyString(value[keys])
      : keys
        .map((key) => this.generateKeyString(value[key]))
        .reduce((result, element) => result + '-' + element);

    return key && meta.name + ':' + key;
  }

  private isString(value: any): value is string {
    return typeof value === 'string';
  }

  private generateKeyString(valueKey: any) {
    if (!valueKey) return;
    return typeof valueKey !== 'object'
      ? valueKey.toString()
      : this.getKey(valueKey);
  }
}
