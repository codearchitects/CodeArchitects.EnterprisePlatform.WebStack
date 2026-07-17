import { Injectable } from '@angular/core';
import { Serializer } from '@ca-webstack/reflection';

@Injectable()
export class SerializerService {
  private serializer = new Serializer();

  public serialize(value: any, replacer?: any, serializeObservables?: boolean, serializeFunctions?: boolean) {
    return this.serializer.serialize(value);
  }

  public deserialize(value: string) {
    return this.serializer.deserialize(value);
  }

}
