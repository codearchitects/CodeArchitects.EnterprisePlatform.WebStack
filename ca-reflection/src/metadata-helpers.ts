/**
 * Helper class for extracting metadata from decorators
 */
export type defineMetadataRetval = (target: any, key?: string) => void;

/**
 * metadata options used for setting and reading meta data informations
 */
export interface IMetadataOptions {
  /**
   * if true reads and combines also parent metadata informations. Default is true.
   */
  inheritParentMetadata?: boolean;
  /**
   * if true calls debugger statement
   */
  debug?: boolean;
}

export interface IMetadataArgs {
  extends?: Function;
}

export class MetadataHelpers {

  /**
   * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
   *
   * @param {string} key - A key used to store and retrieve metadata.
   * @param {any} target - The target object on which the metadata is defined.
   * @param {string} targetKey? - The property key for the target.
   * @param {IMetadataOptions} options? - The metadata options
   * @returns {T} The metadata value for the metadata key if found; otherwise, `undefined`.
   *
   * ### Example
   * ```
   * const IgnoreKey = 'serialization:ignore';
   *
   * function Ignore(flag: boolean = true) {
   *   return function (target: any, key?: string) {
   *     Reflect.defineMetadata(IgnoreKey, flag, target, key);
   *   };
   * }
   *
   * @Ignore(false)
   * class Person {
   *
   *   @Ignore()
   *   private _firstName: string;
   *
   *   @Ignore(false)
   *   public get firstName() { return this._firstName; }
   *   public set firstName(value: string) { this._firstName = value; }
   *
   *   @Ignore(true)
   *   public getFirstName() {
   *     return this._firstName;
   *   }
   * }
   *
   * let metadata = MetaExtractor.getMetadata<boolean>(IgnoreKey, Person);
   * // metadata === false;
   *
   * let metadata = MetaExtractor.getMetadata<boolean>(IgnoreKey, Person, '_firstName');
   * // metadata === true;
   *
   * let metadata = MetaExtractor.getMetadata<boolean>(IgnoreKey, Person, 'firstName');
   * // metadata === false;
   *
   * let metadata = MetaExtractor.getMetadata<boolean>(IgnoreKey, Person, 'getFirstName');
   * // metadata === true;
   *
   * // - or -
   *
   * let person = new Person();
   *
   * let metadata = MetaExtractor.getMetadata<boolean>(IgnoreKey, person);
   * // metadata === false;
   *
   * let metadata = MetaExtractor.getMetadata<boolean>(IgnoreKey, person, '_firstName');
   * // metadata === true;
   *
   * let metadata = MetaExtractor.getMetadata<boolean>(IgnoreKey, person, 'firstName');
   * // metadata === false;
   *
   * let metadata = MetaExtractor.getMetadata<boolean>(IgnoreKey, person, 'getFirstName');
   * // metadata === true;
   * ```
   */
  static __getMetadataCache = new Map<any, Map<string, any>>();
  public static getMetadata<T>(key: string, target: any, targetKey?: string, options?: IMetadataOptions): T {
    if (!target) return null as any;
    let targetCacheKey: any;

    if (typeof target === 'object' || typeof(target) === 'function') {
      targetCacheKey = (target.prototype || target).constructor;
    } else {
      return undefined as any;
    }

    const cacheKey = `${key}/${targetKey || ''}/${options ? options.inheritParentMetadata : ''}`;
    let slot = MetadataHelpers.__getMetadataCache.get(targetCacheKey);
    if (slot) {
      if(slot.has(cacheKey)) {
        return slot.get(cacheKey);
      }
    } else {
      // cache only on real objects
      MetadataHelpers.__getMetadataCache.set(targetCacheKey, slot = new Map());
    }

    if (options && options.inheritParentMetadata) {
      let metadataChain = [];

      for (let i = target; i;) {
        let metadataArgs = MetadataHelpers.getMetadataArgs(key, i, targetKey);
        if (metadataArgs) {
          let args;
          if (Array.isArray(metadataArgs)) {
            args = [];
            for (let j = 0; j < metadataArgs.length; j++) {
              args.push(metadataArgs[j]);
            }
          } else {
            args = {};
            for (let j in metadataArgs) {
              args[j] = metadataArgs[j];
            }
          }
          metadataChain.push(args as never);
        }
        if (metadataArgs && (<IMetadataArgs>metadataArgs).extends) {
          i = (<IMetadataArgs>metadataArgs).extends;
        } else {
          i = MetadataHelpers.getAncestor(i);
        }
      }

      if (metadataChain.length > 0) {
        // let retval = metadataChain.pop();
        let retval = MetadataHelpers.clone(metadataChain.pop());
        for (let i; i = metadataChain.pop();) {
          for (let j in i) {
            switch (j) {
              case 'extends':
                continue;
              case '_privateData':
                for (let k in i[j]) {
                  switch (k) {
                    case 'mapFrom':
                    case 'mapTo':
                    case 'serializableElements':
                      for (let l in i[j][k]) {
                        // retval['_privateData'][k][l] = i[j][k][l];
                        retval['_privateData'][k][l] = MetadataHelpers.clone(i[j][k][l]);
                      }
                      break;
                    default:
                      console.log(k);
                      break;
                  }
                }
                break;
              default:
                // retval[j] = i[j];
                retval[j] = i && i[j] && MetadataHelpers.clone(i[j]);
                break;
            }
          }
        }
        if (slot) {
          slot.set(cacheKey, retval);
        }
        return <T><any>retval;
      }
      return undefined as any;
    } else {
      let retval = MetadataHelpers.getMetadataArgs(key, target, targetKey);
      if (slot && retval) {
        slot.set(cacheKey, retval);
      }
      return retval;
    }
  }

  static clone(item) {
    if (!item) { return item; } // null, undefined values check

    var types = [Number, String, Boolean], result;

    // normalizing primitives if someone did new String('aaa'), or new Number('444');
    types.forEach(function (type) {
      if (item instanceof type) {
        result = type(item);
      }
    });

    if (typeof result === 'undefined') {
      if (Object.prototype.toString.call(item) === '[object Array]') {
        result = [];
        item.forEach(function (child, index, array) {
          result[index] = MetadataHelpers.clone(child);
        });
      } else if (typeof item === 'object') {
        // testing that this is DOM
        if (item.nodeType && typeof item.cloneNode === 'function') {
          var result = item.cloneNode(true);
        } else if (!item.prototype) { // check that this is a literal
          if (item instanceof Date) {
            result = new Date(item);
          } else {
            // it is an object literal
            result = {};
            for (var i in item) {
              result[i] = MetadataHelpers.clone(item[i]);
            }
          }
        } else {
          // depending what you would like here,
          // just keep the reference, or create new object
          if (item.constructor) {
            // would not advice to do that, reason? Read below
            result = new item.constructor();
          } else {
            result = item;
          }
        }
      } else {
        result = item;
      }
    }

    return result;
  }
  /**
   * returns metadata factory function for setting metadata value for the provided metadata key on the target object
    * callback parameter specifies a function delegate to call before associating metadata to given entity giving the
   * possibility to modify metadata arguments before storing it.
   *
   * @param {string} key - A key used to store and retrieve metadata
   * @param {TParams} params - parameter
   *
   * ### Example
   * ```
   * const IgnoreKey = 'serialization:ignore';
   *
   * function IgnoreEx(flag: boolean = true) {
   *   return MetadataHelpers.defineMetadata(IgnoreKey, flag, (target, targetKey) => {
   *     return { tag: target };
   *   });
   * }
   *
   * function Ignore(flag: boolean = true) {
   *   return MetadataHelpers.defineMetadata(IgnoreKey, flag);
   *   //                     ==============
   * }
   *
   * @Ignore(false)
   * class Person {
   *
   *   @Ignore()
   *   private _firstName: string;
   *
   *   @Ignore(false)
   *   public get firstName() { return this._firstName; }
   *   public set firstName(value: string) { this._firstName = value; }
   *
   *   @Ignore(true)
   *   public getFirstName() {
   *     return this._firstName;
   *   }
   * }
   *
   * let metadata = MetaExtractor.getMetadata<boolean>(IgnoreKey, Person);
   * // metadata === false;
   *
   * let metadata = MetaExtractor.getMetadata<boolean>(IgnoreKey, Person, '_firstName');
   * // metadata === true;
   *
   * let metadata = MetaExtractor.getMetadata<boolean>(IgnoreKey, Person, 'firstName');
   * // metadata === false;
   *
   * let metadata = MetaExtractor.getMetadata<boolean>(IgnoreKey, Person, 'getFirstName');
   * // metadata === true;
   *
   * // - or -
   *
   * let person = new Person();
   *
   * let metadata = MetaExtractor.getMetadata<boolean>(IgnoreKey, person);
   * // metadata === false;
   *
   * let metadata = MetaExtractor.getMetadata<boolean>(IgnoreKey, person, '_firstName');
   * // metadata === true;
   *
   * let metadata = MetaExtractor.getMetadata<boolean>(IgnoreKey, person, 'firstName');
   * // metadata === false;
   *
   * let metadata = MetaExtractor.getMetadata<boolean>(IgnoreKey, person, 'getFirstName');
   * // metadata === true;
   * ```
   */
  public static defineMetadata<TParams>(key: any, metadata: TParams, callback?: (target: any, targetKey: string) => TParams): defineMetadataRetval {
    return (target: any, targetKey: string) => {
      if (callback) {
        metadata = callback(target, targetKey);
      }
      let tempKey = MetadataHelpers.getClassName(target) + '::' + key;
      Reflect['defineMetadata'](tempKey, metadata, target, targetKey);
    };
  }

  /**
   * @deprecated
   *
   * returns metadata factory function for setting metadata value for the provided metadata key on the target object.
   * callback parameter specifies a function delegate to call before associating metadata to given entity giving the
   * possibility to modify metadata arguments before storing it.
   *
   * ### Example
   * ```
   * const IgnoreKey = 'serialization:ignore';
   *
   * function Ignore(flag: boolean = true) {
   *   return MetadataHelpers.defineMetadataEx(IgnoreKey, flag, (target, targetKey) => {
   *     return { tag: target };
   *   });
   * }
   *
   * @Ignore(false)
   * class Person {
   * ```
   */
  public static defineMetadataEx<TParams>(key: any, metadata: TParams, callback: (target: any, targetKey: string) => TParams): defineMetadataRetval {
    return MetadataHelpers.defineMetadata(key, metadata, callback);
    // return (target: any, targetKey: string) => {
    //   if (callback)
    //     metadata = callback(target, targetKey);
    //   let tempKey = MetadataHelpers.getClassName(target) + '::' + key;
    //   Reflect['defineMetadata'](tempKey, metadata, target, targetKey);
    // };
  }

  /**
   * returns the class name of a given object
   *
   * ### Example
   * ```
   *
   * let person = new Person();
   *
   * let name = MetadataHelpers.getClassName(person);
   *
   * name will be 'Person'
   *
   * ```
   */
  public static getClassName(target: any): string {
    let constructor = (target.prototype || target).constructor;
    if (constructor === Uint8Array) {
      return 'Uint8Array';
    }
    return constructor && constructor.name;
  }

  /**
   * returns the ancestor of a class.
   *
   * ### Example
   * ```
   * class Base {
   *   public Foo: string;
   * }
   *
   * class Super extends Base {
   *   public Foo2: string;
   * }
   *
   * let x = new Super();
   * let y = MetadataHelpers.getAncestor(x);
   *
   * console.log(y === Base); // will print true
   *
   * ```
   */
  private static getAncestor(v: any): any {
    let retval = Object.getPrototypeOf(v.prototype ? v.prototype : v);
    while (retval && retval.constructor === v.constructor)
      retval = Object.getPrototypeOf(retval);
    return retval;
  }

  /**
   * returns the metadata arguments of class or instance.
   *
   * ### Example
   * ```
   * const IgnoreKey = 'serialization:ignore';
   *
   * function Ignore(flag: boolean = true) {
   *   return function (target: any, key?: string) {
   *     Reflect.defineMetadata(IgnoreKey, flag, target, key);
   *   };
   * }
   *
   * @Ignore(false)
   * class Person {
   *
   *   @Ignore()
   *   private _firstName: string;
   *
   *   @Ignore(false)
   *   public get firstName() { return this._firstName; }
   *   public set firstName(value: string) { this._firstName = value; }
   *
   *   @Ignore(true)
   *   public getFirstName() {
   *     return this._firstName;
   *   }
   * }
   *
   * let person = new Person();
   *
   * MetadataHelpers.getMetadataArgs(IgnoreKey, Person) === MetadataHelpers.getMetadataArgs(IgnoreKey, person)
   *
   * // - or -
   *
   * MetadataHelpers.getMetadataArgs(IgnoreKey, Person, '_firstName') === MetadataHelpers.getMetadataArgs(IgnoreKey, person, '_firstName')
   *
   * // - or -
   *
   * MetadataHelpers.getMetadataArgs(IgnoreKey, Person, 'firstName') === MetadataHelpers.getMetadataArgs(IgnoreKey, person, 'firstName')
   *
   * // - or -
   *
   * MetadataHelpers.getMetadataArgs(IgnoreKey, Person, 'getFirstName') === MetadataHelpers.getMetadataArgs(IgnoreKey, person, 'getFirstName')
   *
   * ```
   */
  private static getMetadataArgs(key: string, target: any, targetKey?: string): any {
    let tempKey = MetadataHelpers.getClassName(target) + '::' + key;

    if (target instanceof Function) {
      return Reflect['getMetadata'](tempKey, Object.create(target.prototype), targetKey)
        || Reflect['getMetadata'](tempKey, target, targetKey);
    } else {
      let meta = Reflect['getMetadata'](tempKey, target.constructor, targetKey);
      if (!meta && typeof target === 'object') {
        meta = Reflect['getMetadata'](tempKey, target, targetKey);
      }
      return meta;
    }
  }
}
