import { Serializer, JsonObject, JsonProperty, JsonIgnore, getJsonObject } from '@ca-webstack/reflection';
import { Subject } from 'rxjs';
import { List, Dictionary } from '@ca-webstack/data-structures';
import * as _ from 'lodash';
import { ObjectList } from './object-list';

/**
 * Dictionary of values added to collection properties on SelfTracking Entities.
 */
@JsonObject({
  name: 'CodeArchitects.Data.ObjectsAddedToCollectionProperties, CodeArchitects.Data'
})
export class ObjectsAddedToCollectionProperties extends Dictionary<string, ObjectList> {

  @JsonIgnore()
  public get keys() {
    return [...this._keys];
  }

  @JsonIgnore()
  public get values() {
    return [...this._values];
  }

  @JsonIgnore()
  public get count() {
    return this._keys.length;
  }
}
