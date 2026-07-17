// tslint:disable no-debugger
import { MetadataHelpers, IMetadataOptions, IMetadataArgs } from './metadata-helpers';
import { ITransformation, Type } from './reflection';
const JsonObjectMetadataKey = 'custom:serializable';
const JsonPropertyMetadataKey = 'custom:serializableElement';

/**
 * Seales a class preventing extensions made to your class
 *
 * ### Example
 *
 * ```
 *  @Sealed
 *  class Person {
 *
 * ```
 */
export function Sealed<T extends Function>(constructor: T) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

/**
 * Returns true if given member can be serialized
 * @function {(object?: T) => boolean}
 */
export type CanSerializePredicate<T> = (object?: T) => boolean;

export interface IJsonPropertyArgs<T> extends IMetadataOptions {
  /**
   * returns true (default) if entity can be serialized
   */
  canSerialize?: boolean | CanSerializePredicate<T>;
  /**
   * gets/sets the transformation
   */
  transformation?: ITransformation<any, any>;
}

export interface ISerializableArgsCacheData {
  _privateData?: {
    mapFrom: { [key: string]: ITransformation<any, any> };
    mapTo: { [key: string]: ITransformation<any, any> };
    serializableElements: { [key: string]: IJsonPropertyArgs<any> };
  };
}

/**
 * arguments for serializable decorator
 */
export interface IJsonObjectArgs<T> extends ISerializableArgsCacheData, IMetadataArgs, ITransformation<any, any> {
  /**
   * returns true (default) if entity can be serialized
   * @function {boolean}
   * @function {canSerializePredicate<T>}
   */
  canSerialize?: boolean | CanSerializePredicate<T>;
  /**
   * the name to use instead of the real name for serialization and deserialization
   */
  name?: string;
  /**
   * delegate of function to invoke before serializing
   * @function {(object: T) => void}
   */
  onSerializing?: (object: T) => void;
  /**
   * delegate of function to invoke after serialization
   * @function {(object: T) => void}
   */
  onSerialized?: (object: T) => void;
  /**
   * delegate of function to invoke before deserialization
   * @function {(object: T) => void}
   */
  onDeserializing?: (object: T) => void;
  /**
   * delegate of function to invoke after deserialization
   * @function {(object: T) => void}
   */
  onDeserialized?: (object: T) => void;
  /**
   * transformations list
   * @function {(object: T) => void}
   */
  transformations?: ITransformation<any, any>[];
  /**
   * if true then will break in decorator function
   */
  debug?: boolean;
}

/**
 * JsonObject class decorator.
 * @param {ISerializableArgs<T>} args
 * Example
 * ```
 * @JsonObject({
 *   canSerialize: true,
 *   name: 'CodeArchitects.MasterData.Person',
 *   onSerializing: (person) => console.log('Person serializing'),
 *   onSerialized: (person) => console.log('Person serialized'),
 *   onDeserializing: (person) => console.log('Person deserializing'),
 *   onDeserialized: (person) => console.log('Person deserialized')
 *   transformations: ITransformation<any, any>[...],
 *   debug: false
 * })
 * class Person {
 *  ....
 * ```
 */
export function JsonObject<T>(args: IJsonObjectArgs<T> = {}) {
  return MetadataHelpers.defineMetadata(JsonObjectMetadataKey, args,
    (target, targetKey) => {
      if (args.debug) {
        debugger;
      }
      const actual = <IJsonObjectArgs<T>>MetadataHelpers.getMetadata(JsonObjectMetadataKey, target);
      if (actual) {
        args._privateData = actual._privateData;
        if (actual.transformations)
          args.transformations = (args.transformations || []).concat(...actual.transformations);
      } else
        args._privateData = { mapFrom: {}, mapTo: {}, serializableElements: {} };
      if (actual && actual.transformations)
        args.transformations = (args.transformations || []).concat(...actual.transformations);
      if (args.name) {
        Type.CacheType(`${args.name}`, target);
      } else {
        if (args.convertFrom || args.convertTo)
          throw new Error('JsonObject convertTo or convertFrom arguments specified without valid name argument.');
        Type.CacheType(Type.getClassName(target), target);
      }
      if (args.transformations) {
        args.transformations.forEach(i => {
          if (args._privateData) {
            if (i.name)
              args._privateData.mapFrom[i.name] = i;
            if (i.originalName)
              args._privateData.mapTo[i.originalName] = i;
          }
        });
      }
      return args;
    });
}

/**
 * JsonProperty field and properties decorator.
 *
 * ### Example
 * ```
 * class Person {
 *   @JsonProperty({
 *     canSerialize: false,
 *     transformations: ITransformation<any, any>{...}
 *   })
 *   private _firstName: string;
 *
 *   @JsonProperty({
 *     canSerialize: true,
 *     transformations: ITransformation<any, any>{...}
 *   })
 *   public get firstName() { return this._firstName; }
 *   public set firstName(value: string) { this._firstName = value; }
 * }
 * ```
 */
export function JsonProperty<T>(args: IJsonPropertyArgs<T> = {}) {
  if (args.debug) {
    debugger;
  }
  if (!args.transformation) {
    args.transformation = {};
  }
  if (!args.transformation.convertFrom) {
    args.transformation.convertFrom = from => from;
  }
  if (!args.transformation.convertTo) {
    args.transformation.convertTo = to => to;
  } return MetadataHelpers.defineMetadata(JsonPropertyMetadataKey, args,
    (target, targetKey) => {
      if (args.debug) debugger;
      let meta = <IJsonObjectArgs<any>>MetadataHelpers.getMetadata(JsonObjectMetadataKey, target.constructor);
      if (!meta) {
        meta = <IJsonObjectArgs<any>>{};
        meta.transformations = [];
        MetadataHelpers.defineMetadata(JsonObjectMetadataKey, meta)(target.constructor);
      } else {
        if (!meta.transformations)
          meta.transformations = [];
      }

      if (args.transformation) {
        if (!args.transformation.originalName)
          args.transformation.originalName = targetKey;
        if (!args.transformation.name)
          args.transformation.name = targetKey;
        meta.transformations.push(args.transformation);
      }
      if (!meta._privateData)
        meta._privateData = { mapFrom: {}, mapTo: {}, serializableElements: {} };
      meta._privateData.serializableElements[targetKey] = args;
      return args;
    });
}

export function JsonIgnore() {
  return JsonProperty({ canSerialize: false });
}

/**
 * getSerializable returns the serializable attributes of the given entity
 *
 * ### Example
 * @serializable
 * ```
 * let theNamespace = getSerializable(person).namespace;
 * ```
 */
export function getJsonObject<T>(target: any, inherit: boolean = false) {
  return MetadataHelpers.getMetadata<IJsonObjectArgs<T>>(JsonObjectMetadataKey, target, undefined, { inheritParentMetadata: inherit });
}

export function getJsonProperty<T>(target: any, targetKey: string, inherit: boolean = false) {
  return MetadataHelpers.getMetadata<IJsonPropertyArgs<T>>(JsonObjectMetadataKey, target, targetKey, { inheritParentMetadata: inherit });
}
