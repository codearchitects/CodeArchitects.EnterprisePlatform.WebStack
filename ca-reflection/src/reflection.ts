// 31 jul 2016: added support for "System.Byte[], mscorlib"
// 12 jul 2016: convertFrom and convertTo added to JsonObject decorator
// 18 nov 2015: unicode character decode support
// 18 nov 2015: fixed scalar datetime value
// 6 nov 2015: fixed datetime support to new deserializer
// 21 oct 2015: new deserialization method
// 15 oct 2015: different $id and ref implementation
// 01 apr 2015: cleanscript support
// 22 nov 2013: serialization of byte arrays
// 01 nov 2013: empty string observable serialization and deserialization
// 01 nov 2013: observable with undefined content serialization and deserialization
// 01 nov 2013: observable serialization and deserialization
// 23-24 oct 2013: added observable (array and not) de/serialization support
// 23 oct 2013: added function de/serialization support

// module System.Runtime {
//   export function With<T>(context: T, fn: () => void) {
//     _with(context, fn);
//   }
// }

// Uint8Array.prototype['toJSON'] = (serializer: System.Reflection.Serializer) => {
//   return System.Data.ConvertUint8ArrayToJson(serializer['_value']);
// }

/*tslint evil: false */

// import {Map, Set} from 'es6-collections';
// import * as ko from 'knockout';
import * as reflectionDecorators from './reflection-decorators';
import * as Base64 from './base64';
import { DateOnly, DateTimeOffset } from '@ca-webstack/data-structures';

// declare let $hh: any;
const $hh: any = undefined;


// if (!window && window['Map']) {
//   window['Map'] = Collections._Map;
//   window['Set'] = Collections._Set;
// }

export function isFunction(obj) {
  return typeof obj === 'function';
}

export function evaluate(value: string) {
  return Function('return ' + value)();
  // return eval(value);
}

export interface ISerializingCompanion {
  onSerializing(): void;
  onSerialized(): void;
}

export class ActivatorException {
  constructor(public message) {
  }
}

/**
 * contains a field name and value
 */
export class FieldContainer<T> {
  constructor(public name?: string, public value?: T) {
  }
}

/**
 * contains the necessary info for renaming and transforming a field during serialization (To) or deserialization (From)
 */
export interface ITransformation<TSource, TTarget> {
  /**
   * name used when converting to (serialization)
   */
  name?: string;
  /**
  * name used when converting from (deserialization) to original name. This value is set internally from decorator setter.
  */
  originalName?: string;
  /**
   * optional namespace used when converting to target (serialization)
   */
  namespace?: string;
  /**
   * if specificed contains transformation logic used during serialization. Output will be taken in serialized field
   */
  convertTo?: (value: TSource) => TTarget;
  /**
   * if specificed contains transformation logic used during deserialization (from target to source). Output will be taken in deserialized field
   */
  convertFrom?: (value: TTarget) => TSource;
}

/**
 * called when serializing (from source To target)
 */
export function ConvertTo<TSource, TTarget>(transformation: ITransformation<TSource, TTarget>, value: TSource)
  : FieldContainer<TTarget> | FieldContainer<TSource> {
  if (transformation.convertTo)
    return new FieldContainer(transformation.name || transformation.originalName, transformation.convertTo(value)); else
    return new FieldContainer(transformation.name || transformation.originalName, value);
}

/**
 * called when deserializing (From target to source)
 */
export function ConvertFrom<TSource, TTarget>(transformation: ITransformation<TSource, TTarget>, value: TTarget)
  : FieldContainer<TTarget> | FieldContainer<TSource> {
  if (transformation.convertFrom)
    return new FieldContainer(transformation.originalName || transformation.name, transformation.convertFrom(value)); else
    return new FieldContainer(transformation.originalName || transformation.name, value);
}

export type SerializerOptions = {
  typeRemapper?: { [source: string]: string; };
  replacer?: any;
  serializeObservables?: boolean;
  serializeFunctions?: boolean;
  disableMetadata?: boolean;
  enableDateTimeOffset?: boolean;
};

export class Activator {
  // public static _registrations: Map<string, string> = new Map<string, string>();
  public static _prototypes: Map<string, any> = new Map<string, any>();

  public static createInstance<T>(name: string, failIfNotFound: boolean = false): T {
    let temp: any = null;
    try {
      let result, prototype;
      prototype = Activator._prototypes.get(name) || Type._typesCache.get(name).prototype;
      if (!prototype) {
        if (name.lastIndexOf(',') > 0) {
          if (name.indexOf('TrackableCollection`1') >= 0) {
            // let result2 = <any>ko.observableArray<any>();
            const result2 = <any>[];
            result2.$type = name;
            return <T>result2;
          }
        } else {
          if (temp = evaluate(name)) {
            Activator._prototypes.set(name, prototype = temp.prototype);
          } else {
            throw new Error('Unknown type found ' + name);
          }
        }
      }
      if (prototype) {
        result = Object.create(prototype);
        result = new result.constructor(result);
        result.$type = name;
        return <T>result;
      }
      if (failIfNotFound)
        throw new ActivatorException('unknown type name: ' + name);
    } catch (exc) {
      if (failIfNotFound)
        throw new ActivatorException('failed to create instance: ' + name + ' with error message: ' + exc.message);
    }
    // console.log(' *** UNRESOLVED: ' + name);
    const result: any = new Object;
    result.$type = name;
    return <T>result;
  }

  // public static register(target: any, source: any) {
  //  this._registrations[source] = target;
  // }
}

export class Type {
  static _typesCache = new Map<any, any>();
  static _namespaces = new Set<any>();

  public static CacheTypes(namespace: string, root?: any) {
    // Type._cacheNamespaces(namespace, eval((namespace.lastIndexOf('.')+1) === namespace.length ? namespace.substring(0, namespace.length - 1) : namespace));
    Type._cacheTypes(namespace, root);
  }


  private static isConstructor(f) {
    try {
      new f();
    } catch (err) {
      return false;
    }
    return true;
  }

  public static getClassName(target: any): string {
    const isConstructor = Type.isConstructor(target);
    const name = (target && !isConstructor && target.constructor && target.constructor.name) || (target && isConstructor && target.name);
    if (name) {
      return name;
    } else {
      const funcNameRegex = /function (.{1,})\(/;
      const results = (funcNameRegex).exec(<any>(target.prototype || target).constructor.toString());
      return (results && results.length > 1) ? results[1] : '';
    }
    // var funcNameRegex = /function (.{1,})\(/;
    // var results = (funcNameRegex).exec(<any>(target.prototype || target).constructor.toString());
    // return (results && results.length > 1) ? results[1] : '';
  }

  public static GetName(obj: any): string | null {
    if (obj && obj.constructor) {
      return Type._typesCache.get(obj.constructor) || Type._typesCache.get(obj);
    }
    return null;
  }

  public static CacheType(key: string, obj: any) {
    Type._typesCache.set(key, obj);
    Type._typesCache.set(obj, key);
  }

  private static _cacheNamespaces(ns?: string, node?) {
    if (!Type._namespaces.has(ns)) {
      // console.log(ns);
      Type._namespaces.add(ns);
      for (const i in node) {
        if (!isNaN(+i))
          break;
        const t = node[i];
        if (typeof t === 'string')
          break;
        if (!t.prototype) {
          Type._cacheNamespaces(ns + i + '.', t);
        }
      }
    }
  }

  private static _cacheTypes(ns?: string, node?) {
    if (ns && !node) {
      if ((<number>ns.length) > 1 && ns.slice(-1) === '.') {
        node = evaluate(ns.substring(0, ns.length - 1));
      } else {
        node = evaluate(ns);
        ns = ns + '.';
      }
    }
    if (!ns) ns = '';
    if (!node) {
      return;
    }
    Type._cacheTypesDeep(ns, node, new Set());
  }

  private static _cacheTypesDeep(ns?: string, node?: any, visited?: Set<any>) {
    for (const i in node) {
      if (i.substring(0) === '$' || i.indexOf('jQuery') === 0 || i === 'ko' || i === '__ko_proto__' || i === '_typesCache' || i === 'fn')
        continue;
      const key = node[i];
      if (i !== 'document' && key && key.toString && key.constructor && (typeof key === 'object' || typeof key === 'function')) {
        if (visited && !visited.has(key)) {
          visited.add(key);
          const exists = Type._typesCache.has(key);
          if (!exists) {
            console.log('caching ' + ns + i.toString());
            Type._typesCache.set(ns + i.toString(), key);
            Type._typesCache.set(key, ns + i.toString());
          }
          try {
            Type._cacheTypesDeep(ns + i.toString() + '.', key, visited);
          } catch (exc) {
            console.log(exc.toString());
          }
        }
      }
    }
  }
}

export class Serializer {
  private static __serializingCounter: number = 0;
  private static __deserializingCounter: number = 0;
  /**
   * Whether serializer automatically deserializes yyyy-mm-dd strings into DateOnly data structure or not
   */
  public static useDateOnly = true;
  public serializeObservables: boolean = false;
  public serializeFunctions: boolean = false;
  public disableMetadata: boolean = false;
  protected enableDateTimeOffset = true;
  private _property: any = '';
  private _holder = new Object;
  private _objectStack = [];
  private _refObjects: any = [];
  private _replacerFunction: any;
  private _value: any;
  private _replacer: any;
  private _propertyIndex: any;
  private _id: number = 0;
  private _options: SerializerOptions;
  public typeRemapper: { [source: string]: string; } = <any>new Object();

  public static getType(o): string | undefined | null {
    if (o === undefined) return undefined;
    if (o === null) return null;
    const result = /function (.+)\(/.exec(o.constructor.toString());
    if (result)
      return result[1]; else
      return null;
  }
  constructor(options?: SerializerOptions) {
    this._options = options;
    this.typeRemapper = options && options.typeRemapper || <any>new Object();
    this.serializeObservables = options && options.serializeObservables;
    this.disableMetadata = options && options.disableMetadata;
    this.serializeFunctions = options && options.serializeFunctions;
    this._replacer = options && options.replacer;
    this.enableDateTimeOffset = options?.enableDateTimeOffset !== undefined ? options.enableDateTimeOffset : this.enableDateTimeOffset;
  }

  public static get isSerializing(): boolean {
    return Serializer.__serializingCounter > 0;
  }

  public static get isDeserializing(): boolean {
    return Serializer.__deserializingCounter > 0;
  }

  public deserialize(source: string): any {
    try {
      Serializer.__deserializingCounter++;
      let jsonData: string;
      try {
        const unicodeMatcher = /\\u([\d\w]{4})/gi;
        let temp = source.replace(unicodeMatcher, function (match, grp) {
          return String.fromCharCode(parseInt(grp, 16));
        });
        temp = decodeURI(temp);
        jsonData = JSON.parse(temp);
      } catch (e) {
        jsonData = evaluate('(' + source + ')');
      }

      const references: any = [];
      const self = this;

      const parseValue = (value) => {
        // check if ISO Date
        const isoDateRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)(?:([\+-])(\d{2})\:(\d{2}))?Z?$/;
        const isoDateOnlyRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
        const isoDateTimeOffsetRegex = /^(?:(?:19|20)\d\d)-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d+)?([+-](0[0-9]|1[0-4]):[0-5]\d)$/;
        if (this.enableDateTimeOffset && isoDateTimeOffsetRegex.test(value)) {
          return DateTimeOffset.fromISO8601String(value);
        } else if (isoDateRegex.test(value)) {
          return new Date(value);
        } else if (Serializer.useDateOnly && isoDateOnlyRegex.test(value)) {
          return new DateOnly(value);
        } else {
          return value;
        }
      };

      const visit = (holder, key, theValue?) => {
        let classDecorator: reflectionDecorators.IJsonObjectArgs<any> | undefined;
        const value = (holder && holder[key]) || theValue;
        let current = value, skip = false;
        if (value && typeof value === 'object') {
          if (value.$values) {
            current = Activator.createInstance(value.$type);
            if (current.constructor.name === 'Object') {
              current = value.$values;
            }
            const values = value.$values.map((v, k) => (typeof v === 'object') ? visit(value.$values, k) : v);
            classDecorator = !this.disableMetadata && reflectionDecorators.getJsonObject(current, true);
            if (classDecorator && classDecorator.convertFrom) {
              current = references[value.$id] = classDecorator.convertFrom(values);
            } else {
              current = values;
            }
          } else {
            const typeName = self.typeRemapper[value.$type] || value.$type;
            delete value.$type;
            if (typeName) {
              switch (typeName) {
                case 'System.Byte[], mscorlib':
                case 'System.Byte[], System.Private.CoreLib':
                  const raw = Base64.atob(value.$value);
                  const rawLength = raw.length;
                  current = new Uint8Array(rawLength);
                  for (let i = 0; i < rawLength; i++) {
                    current[i] = raw.charCodeAt(i);
                  }
                  break;
                case 'Map':
                  current = references[value.$id] = new Map<any, any>();
                  for (let k = 0; k < value.values.length; k++) {
                    const i = value.values[k];
                    const temp = visit(null, null, i.v);
                    if (i.v.$id) references[i.v.$id] = temp;
                    current.set(i.k, temp);
                  }
                  skip = true;
                  break;
                case typeName.includes('System.Collections.Generic.Dictionary') ? typeName : null:
                  current = references[value.$id] = new Map<any, any>();
                  for (let k = 0; k < Object.keys(value).length; k++) {
                    const i = Object.keys(value)[k];
                    const temp = visit(null, null, Object.values(value)[k]);
                    if (i) references[i] = temp;
                    current.set(Object.keys(value)[k], temp);
                  }
                  skip = true;
                  break;
                case 'Set':
                  current = references[value.$id] = new Set<any>();
                  for (let k = 0; k < value.values.length; k++) {
                    const i = value.values[k];
                    const temp = visit(null, null, i);
                    if (i.$id) references[i.$id] = temp;
                    current.add(temp);
                  }
                  skip = true;
                  break;
                default:
                  current = references[value.$id] = Activator.createInstance(typeName);
                  classDecorator = !this.disableMetadata && reflectionDecorators.getJsonObject(current, true);
                  if (classDecorator && classDecorator.convertFrom) {
                    current = references[value.$id] = classDecorator.convertFrom(value);
                    skip = true;
                  }
                  if (classDecorator && classDecorator.onDeserializing)
                    classDecorator.onDeserializing(current);
                  if (current.OnDeserializingMethod && typeof current.OnDeserializingMethod === 'function') current.OnDeserializingMethod();
                  break;
              }
            } else
              if (value.$ref)
                return references[value.$ref]; else
              /*if (value.$observableValues) {
                let values = value.$observableValues;
                let array = [];
                if (values && values.length) {
                  for (const k = 0; k < values.length; k++) {
                    array.push(visit(null, null, values[k]));
                  }
                }
                current = <any>ko.observableArray(array);
                delete value.$observableValues;
              } else if (value.$observable) {
                current = <any>ko.observable(visit(null, null, value.$observableValue));
                delete value.$observableValue;
              } else*/ if (value.$body) {
                  const body = value.$body;
                  delete body.$body;
                  const startBody = body.indexOf('{') + 1;
                  const endBody = body.lastIndexOf('}');
                  const startArgs = body.indexOf('(') + 1;
                  const endArgs = body.indexOf(')');
                  current = new Function(body.substring(startArgs, endArgs), body.substring(startBody, endBody));
                } else if (value.$hostObject) {
                  if ($hh)
                    current = $hh.deserializeHostObject(value.$hostObject); else
                    current = { $hostObject: value.$hostObject };
                }
            if (current.$id)
              references[current.$id] = current;
            if (!skip) {
              for (const j in value) {
                const v = value[j];
                let newValue;
                const transformation = classDecorator && classDecorator._privateData && classDecorator._privateData.mapFrom[j];
                let targetPropName: string | undefined = j;
                if (transformation)
                  targetPropName = transformation.originalName;
                if (typeof v === 'function')
                  continue;
                if (typeof v === 'object')
                  newValue = visit(value, j); else
                  newValue = parseValue(v);
                if (transformation && transformation.convertFrom)
                  newValue = transformation.convertFrom(newValue);
                try {
                  if (targetPropName)
                    current[targetPropName] = newValue;
                } catch (e) { }
              }
            }
          }
          // decorator = reflectionDecorators.getSerializable(current);
          if (classDecorator) {
            if (classDecorator.onDeserialized)
              classDecorator.onDeserialized(current);
          }
          if (current.OnDeserializedMethod && typeof current.OnDeserializedMethod === 'function')
            current.OnDeserializedMethod();
        } else {
          return parseValue(current);
        }
        if (current) {
          delete current.$type;
          delete current.$id;
        }
        return current;
      };
      return visit({ '': jsonData }, '');
    } finally {
      Serializer.__deserializingCounter--;
    }
  }

  /**
   * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
   * @param value A JavaScript value, usually an object or array, to be converted.
   */
  public serialize(value: any): any {
    try {
      Serializer.__serializingCounter++;
      if (typeof this._replacer === 'function') {
        this._replacerFunction = this._replacer;
      }

      if (Object.prototype.toString.call(this._replacer) === '[object Array]') {
        this._propertyIndex = {};
        for (let i = 0; i < this._replacer.length; i++) {
          this._propertyIndex[this._replacer] = true;
        }
      }
      // this._value = !this.serializeObservables ? ko.unwrap(value) : value;
      this._value = value;
      this._holder = this._value;
      this._id = 0;

      try {
        return this._serialize(this._value);
      } finally {
        const t = this._refObjects;
        for (let i = 0; i < t.length; i++) {
          delete t[i].$id;
          delete t[i].$type;
        }
        this._refObjects = [];
      }
    } finally {
      Serializer.__serializingCounter--;
    }
  }

  private serializeHostObject(v, context: Serializer) {
    this._objectStack.pop();
    if ($hh && !$hh.isVoidResult(v))
      return '{ "$hostObject": "' + $hh.serializeHostObject(v) + '"}'; else
      return '{}';
  }

  private checkId(v: any): string {
    // v = koUnwrap(v);
    if (!v.$id) {
      try {
        const $id = (++this._id).toString();
        if (Object.isFrozen(v)) {
          v = { ...v, $id };
        } else {
          v.$id = $id // assign unique id
        }
      } catch (e) {
        console.error(e);
      }
      this._refObjects.push(v);
    }
    return v.$id;
  }

  private serializeObject(v) {
    const decoratorMeta = !this.disableMetadata && reflectionDecorators.getJsonObject(v, true);
    // search first if yetserialized object (in graph)

    if (decoratorMeta && decoratorMeta.convertTo)
      v = decoratorMeta.convertTo(v);

    if (v.$id) {
      return '{"$ref":"' + v.$id + '"}';
    } else {
      this.checkId(v);
    }
    let typeName = Type.GetName(v);

    if (decoratorMeta && decoratorMeta.onSerializing)
      decoratorMeta.onSerializing(v);
    if (decoratorMeta && decoratorMeta.name)
      typeName = decoratorMeta.name;

    try {
      if ((<ISerializingCompanion>v).onSerializing) {
        (<ISerializingCompanion>v).onSerializing();
      }
    } catch (e) { }

    if (typeName) {
      v['$type'] = (this.typeRemapper && this.typeRemapper[typeName]) || typeName;
    }

    try {
      this._holder = v;
      const result: any = [];
      const methods: any = [];

      // V8 CleanScript object
      if (typeName || v.toString() !== '[object HostObject]') {
        for (const p in v)
          methods.push(p);
      }

      for (let j = 0; j < methods.length; j++) {
        const methodRead: string = methods[j];

        if (methodRead === 'constructor')
          continue;

        let c2; // = method.substr(0, 2);
        const c1 = methodRead.substr(0, 1);

        if (c1 === '_' || (c2 = methodRead.substr(0, 2)) === '$_' || c2 === '$$' || c2 === 'ko')
          continue;

        let methodWrite: string = methodRead;

        let value = v[methodRead];
        // let decoratorElement = reflectionDecorators.getSerializableElement(v, methodRead, true);
        const decoratorElement = decoratorMeta && decoratorMeta._privateData && decoratorMeta._privateData.serializableElements[methodRead];
        if (decoratorElement) {
          if (decoratorElement.canSerialize === false)
            continue;
          if (decoratorElement.transformation) {
            const convertedValue = ConvertTo(decoratorElement.transformation, value);
            value = convertedValue.value;
            if (convertedValue.name)
              methodWrite = convertedValue.name;
          }
        }

        if (value === undefined || value === null)
          continue;

        this._property = methodRead;

        if (!this._propertyIndex || this._propertyIndex.hasOwnProperty(methodRead)) {
          const c = this._serialize(value);
          if ((c === undefined && !this.serializeObservables) || (c === undefined && this.serializeObservables && typeof value === 'function'))
            continue;
          const newValue = this.serializeString(methodWrite, this) + ':' + c;
          if (c1 === '$')
            result.splice(0, 0, newValue); else
            result.push(newValue);
        }
      }

      this._objectStack.pop();
      if (!result.length) return '{}';
      return '{' + result.join(',') + '}';
    } finally {
      try {
        if (decoratorMeta && decoratorMeta.onSerialized)
          decoratorMeta.onSerialized(v);
      } catch (e) { }
      try {
        if ((<ISerializingCompanion>v).onSerialized) {
          (<ISerializingCompanion>v).onSerialized();
        }
      } catch (e) { }
    }
  }

  private serializeFunction(v, context: Serializer) {
    switch (Serializer.getType(v.prototype)) {
      case 'observable':
        const content = v();
        if (true || content || content === '') {
          const type: string = v && (v.$type || (v() && v().$type));
          switch (Serializer.getType(content)) {
            case 'Array':
              if (context.serializeObservables) {
                return '{"$id":"' + (++context._id).toString() + '","$array": "true","$observable": "true"'
                  + (type ? ', "$type": "' + ((context.typeRemapper && context.typeRemapper[type]) || type) : '')
                  + ',"$observableValues": ' + context._serialize(v()) + '}';
              } else {
                if (type && type.indexOf('TrackableCollection`1') > 0) {
                  return '{"$id":"' + (++context._id).toString() + '"' + ',"$values": '
                    + context._serialize(v()) + '}';
                } else {
                  return '{"$id":"' + (++context._id).toString() + '"' + (type ? ',"$type": "'
                    + ((context.typeRemapper && context.typeRemapper[type]) || type) + '"' : '') + ',"$values": ' + context._serialize(v()) + '}';
                }
              }
            // break;
            default:
              if (context.serializeObservables) {
                // let value: any = context._serialize(v());
                return '{"$id":"' + (++context._id).toString() + '","$observable": "true"'
                  + (type ? ', "$type": "' + ((context.typeRemapper && context.typeRemapper[type]) || type) : '')
                  + ',"$observableValue": ' + context._serialize(v()) + '}';
              } else {
                return context._serialize(v());
              }
          }
        }
      // tslint:disable no-switch-case-fall-through
      default:
        if (context.serializeFunctions) {
          const content = v.toString();
          if (content) {
            return '{"$id":"' + (++context._id).toString() + '", "$type": "Function", "$body":' + context._serialize(content) + '} ';
          }
        }
        break;
    }
    return undefined;
  }

  private serializeUint8Array(array: Uint8Array, context: Serializer) {
    let value: string = '';
    array.forEach(i => value += String.fromCharCode(i));
    return `{'$type': 'System.Byte[], System.Private.CoreLib', '$value':'${Base64.btoa(value)}'}`;
  }

  private serializeArray(v, context: Serializer) {
    this._holder = v;
    const result: any = [];
    this._holder = v;
    for (let i = 0; i < v.length; i++) {
      this._property = i;
      const c = this._serialize(v[i]);
      if (c !== undefined) {
        result.push(c);
      } else
        result.push(null);
    }
    this._objectStack.pop();
    if (!result.length) return '[]';
    return '[' + result.join(',') + ']';
  }

  private serializeString(v: string, context: Serializer): string {
    return '"' + v.replace(/(["\\])/g, '\\$1').replace(/[\u0000-\u001F]/g, function (t) {
      const code = t.charCodeAt(0).toString(16);
      return '\\u' + Array(5 - code.length).join('0') + code;
    }) + '"';
  }

  private serializeMap(v: Map<any, any> | any, context: Serializer): string {
    const values: any = [];
    v.forEach((value, index, map) => {
      values.push(`${this._serialize(index)}:${this._serialize(value)}`);
    });
    return '{"$id":"' + (v.$id || this.checkId(v)) + '",' + values.join(',') + '}';
  }

  private serializeSet(v: Set<any> | any, context: Serializer): string {
    const values: any = [];
    v.forEach((value, index, map) => {
      values.push(this._serialize(index));
    });
    return '{"$id":"' + (v.$id || this.checkId(v)) + '","$type": "Set","values":[' + values.join(',') + ']}';
  }
  /**
   * Serializes provided value in a date only format. Time is considered as UTC one, so timezone offset will be removed.
   * @param v Value to be serialized
   * @returns Serializable ISO Date
   */
  private serializeDateOnly(v: DateOnly, context: Serializer): string {
    return `"${v.toISOString().split('T')[0]}"`;
  }

  private serializeDateTimeOffset(v: DateTimeOffset, context: Serializer): string {
    return  `"${v.toISO8601String()}"`;
  }

  private serializeDate(v: Date, context: Serializer) {
    return `"${v.toISOString()}"`;
  }
  private serializeNumber(v, context: Serializer) {
    return v.toString();
  }
  private serializeBigInt(v, context: Serializer) {
    return v.toString() + 'n';
  }

  private serializeBoolean(v, context: Serializer) {
    return v.toString();
  }

  private serializeUndefined(v, context: Serializer) {
    return undefined;
  }

  private _serialize(value): string | undefined {
    let tempValue = value;
    const serializerDecorator = !this.disableMetadata && reflectionDecorators.getJsonObject(tempValue);
    let canSerialize = true;
    if (serializerDecorator) {
      if (serializerDecorator.canSerialize instanceof Function) {
        canSerialize = (<reflectionDecorators.CanSerializePredicate<any>>serializerDecorator.canSerialize)(tempValue);
      } else {
        canSerialize = (serializerDecorator.canSerialize === undefined) || <boolean>serializerDecorator.canSerialize;
      }
      if (!canSerialize)
        return undefined;
    }
    let retval: string = '';
    if (this._replacerFunction)
      tempValue = this._replacerFunction.call(this._holder, this._property, tempValue);
    if (typeof tempValue === 'object') {
      if (tempValue === null) return 'null';
      if (tempValue.constructor === Date) return this.serializeDate(tempValue, this);
      if (tempValue.constructor === DateOnly) return this.serializeDateOnly(tempValue, this);
      if (tempValue.constructor === DateTimeOffset) return this.serializeDateTimeOffset(tempValue, this);
      if (tempValue.constructor === Map) return this.serializeMap(tempValue, this);
      if (tempValue.constructor === Set) return this.serializeSet(tempValue, this);
      if (tempValue.toJSON) return /*this._serialize(*/tempValue.toJSON(this)/*)*/;
      if (tempValue.constructor === Number) return this.serializeNumber(tempValue, this);
      if (tempValue.constructor === BigInt) return this.serializeBigInt(tempValue, this);
      if (tempValue.constructor === String) return this.serializeString(tempValue as any, this);
      if (tempValue.constructor === Boolean) return this.serializeBoolean(tempValue, this);
      if (tempValue.constructor === Array) return this.serializeArray(tempValue, this);
      if (tempValue.constructor === Uint8Array) return this.serializeUint8Array(tempValue, this);
      if (tempValue.toString() === '[object HostObject]') return this.serializeHostObject(tempValue, this);
      retval = this.serializeObject(tempValue);
    } else {
      retval = {
        'function': this.serializeFunction,
        'string': this.serializeString,
        'number': this.serializeNumber,
        'bigint': this.serializeBigInt,
        'boolean': this.serializeBoolean,
        'undefined': this.serializeUndefined
      }[typeof tempValue](tempValue, this);
    }
    return retval;
  }
}

// global && (global.System = System);
