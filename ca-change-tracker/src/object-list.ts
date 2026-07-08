import { Serializer, JsonObject, JsonProperty, JsonIgnore, getJsonObject, Enumerable } from '@ca-webstack/reflection';
import { Subject } from 'rxjs';
import { List, Dictionary } from '@ca-webstack/data-structures';
import { ListUtils } from './list-utils';

/**
 * List of values added to or removed from a collection property on SelfTracking Entities.
 */
@JsonObject({
  name: 'CodeArchitects.Data.ObjectList, CodeArchitects.Data',
  convertFrom: (arr) => ListUtils.convertArrToLst(ObjectList, arr)
})
export class ObjectList extends List<any> {
  @JsonProperty({
    transformation: {
      name: '$values',
      convertTo: (lst) => [...lst],
      convertFrom: (arr) => [...arr]
    }
  })
  @Enumerable()
  private get collection() {
    return [...this._collection];
  }

  @JsonIgnore()
  public get count() {
    return this._collection.length;
  }
}
