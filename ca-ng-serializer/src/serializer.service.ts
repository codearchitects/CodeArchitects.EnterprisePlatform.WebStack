import { inject, Injectable } from '@angular/core';
import { Serializer } from '@ca-webstack/reflection';
import { CAEP_SERIALIZER_CONFIG } from './tokens';

@Injectable()
export class SerializerService {

  private _serializerConfig = inject(CAEP_SERIALIZER_CONFIG, { optional: true }) ?? {};
  private serializer = new Serializer(this._serializerConfig);

  public serialize(value: any, replacer?: any, serializeObservables?: boolean, serializeFunctions?: boolean) {
    return this.serializer.serialize(value);
  }

  public deserialize(value: string) {
    return this.serializer.deserialize(value);
  }

}
