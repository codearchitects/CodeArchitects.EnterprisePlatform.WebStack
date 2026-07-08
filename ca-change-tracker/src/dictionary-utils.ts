import { Serializer, JsonObject, JsonProperty, JsonIgnore, getJsonObject } from '@ca-webstack/reflection';
import { List, Dictionary } from '@ca-webstack/data-structures';

export class DictionaryUtils {
  public static convertDicToObj(type, dic: Dictionary<string, any>) {
    let obj = dic.keys.reduce((obj, key) => {
      obj[key] = dic.get(key);
      return obj;
    }, {});
    let meta = getJsonObject(type);
    obj['$type'] = meta.name;
    return obj;
  }

  public static convertObjToDic(type, obj: any) {
    return Object.keys(obj)
      .filter((key) => key !== '$type' && key !== '_keys' && key !== '_values')
      .reduce((dic, key) => {
        dic.add(key, obj[key]);
        return dic;
      }, new type);
  }
}
