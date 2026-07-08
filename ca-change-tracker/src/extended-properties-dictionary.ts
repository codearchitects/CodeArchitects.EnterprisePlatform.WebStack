import { Serializer, JsonObject, JsonProperty, JsonIgnore, getJsonObject } from '@ca-webstack/reflection';
import { Subject } from 'rxjs';
import { List, Dictionary } from '@ca-webstack/data-structures';

@JsonObject({
  name: 'CodeArchitects.Data.ExtendedPropertiesDictionary, CodeArchitects.Data'
})
export class ExtendedPropertiesDictionary extends Dictionary<string, any> {
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
