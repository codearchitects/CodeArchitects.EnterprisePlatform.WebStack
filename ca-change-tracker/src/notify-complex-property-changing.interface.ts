import { Serializer, JsonObject, JsonProperty, JsonIgnore, getJsonObject } from '@ca-webstack/reflection';
import { Subject } from 'rxjs';
import { List, Dictionary } from '@ca-webstack/data-structures';

/**
 * Represents an entity with complex property changing event emitter.
 */
export interface INotifyComplexPropertyChanging {
  complexPropertyChanging: Subject<any>;
}
