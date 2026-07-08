import { Serializer, JsonObject, JsonProperty, JsonIgnore, getJsonObject } from '@ca-webstack/reflection';
import { Subject } from 'rxjs';
import { List, Dictionary } from '@ca-webstack/data-structures';
import { NotifyCollectionChangedEventArgs } from './notify-collection-changed-event-args.interface';

/**
 * Array that emit a collection changed event when his internal state chenge.
 */
@JsonObject({
  name: 'CodeArchitects.Data.TrackableCollection, CodeArchitects.Data'
})
export class TrackableCollection<T> extends Array<T> {
  @JsonIgnore() private _collectionChanged: Subject<NotifyCollectionChangedEventArgs<T>>;

  /**
   * Emit an event on collection changed.
   *
   * @return Collection changed event emitter.
   *
   * ### Example
   * ```
   * trackableCollection.collectionChanged
   *   .subscribe([collection-changed-cb]);
   * ```
   */
  @JsonIgnore()
  public get collectionChanged() {
    if (!this._collectionChanged) {
      this._collectionChanged = new Subject<NotifyCollectionChangedEventArgs<T>>();
    }
    return this._collectionChanged;
  }
}
