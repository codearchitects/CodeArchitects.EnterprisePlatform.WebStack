import { List, Dictionary } from '@ca-webstack/data-structures';
import { Serializer, JsonObject, JsonProperty, JsonIgnore, getJsonObject } from '@ca-webstack/reflection';


export class ListUtils {
  public static convertLstToArr(type, lst: List<any>) {
    let arr = lst.toArray();
    let meta = getJsonObject(type);
    arr['$type'] = meta.name;
    return arr;
  }

  public static convertArrToLst(type, arr: Array<any>) {
    let lst = new type;
    arr.forEach((e) => lst.add(e));
    return lst;
  }
}
