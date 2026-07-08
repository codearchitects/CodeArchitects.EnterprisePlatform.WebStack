import { Serializer, JsonObject, JsonProperty, JsonIgnore, getJsonObject } from '@ca-webstack/reflection';
import { Subject } from 'rxjs';
import { List, Dictionary } from '@ca-webstack/data-structures';
import { PropertyChangedEventArgs } from './property-changed-event-args';

/**
 * Represents an entity with property changed event emitter.
 */
export interface INotifyPropertyChanged {
  propertyChanged: Subject<PropertyChangedEventArgs>;
}
