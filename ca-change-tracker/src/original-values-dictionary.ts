import { Serializer, JsonObject, JsonProperty, JsonIgnore, getJsonObject } from '@ca-webstack/reflection';
import { Subject } from 'rxjs';
import { List, Dictionary } from '@ca-webstack/data-structures';
import * as _ from 'lodash';

/**
 * Dictionary of original values for all properties that was changed on SelfTracking Entities.
 */
@JsonObject({
  name: 'CodeArchitects.Data.OriginalValuesDictionary, CodeArchitects.Data'
})
export class OriginalValuesDictionary extends Dictionary<string, any> {
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
