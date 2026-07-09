import { isNoU } from '../utilities/common.utility';
import { CaepCoerceArrayString, CaepCoerceBoolean, CaepCoerceCssPixel, CaepCoerceNumber } from './coercion.decorator';

export enum CaepCoercionType {
  Boolean,
  CssPixel,
  Number,
  ArrayToString
}

/**
 * Description of CaepOption decorator params.
 */
export interface ICaepOptionParams {
  /**
   * Default value to assign to the option
   */
  defaultValue?: any;

  /**
   * Type of coercion to adopt for the option
   */
  coercionType?: CaepCoercionType;
}

/**
 * Decorator useful to describe options, allowing default value and coercion type definition.
 *
 *
 * @param params ICaepOptionParams object for params specification
 *
 * ### Example
 * ```
 * @CaepOption({ defaultValue: false, coercionType: CaepCoercionType.Boolean })
 * isReadonly?: any;
 * ```
 */
export function CaepOption(params: ICaepOptionParams) {
  return function (target: any, key: string) {
    let coercionGetter, coercionSetter;

    if (!isNoU(params.coercionType)) {
      if (params.coercionType === CaepCoercionType.Boolean) CaepCoerceBoolean()(target, key);
      else if (params.coercionType === CaepCoercionType.CssPixel) CaepCoerceCssPixel()(target, key);
      else if (params.coercionType === CaepCoercionType.Number) CaepCoerceNumber()(target, key);
      else if (params.coercionType === CaepCoercionType.ArrayToString) CaepCoerceArrayString()(target, key);

      const descriptor = Object.getOwnPropertyDescriptor(target, key);
      coercionGetter = descriptor?.get;
      coercionSetter = descriptor?.set;
    }

    if (!isNoU(params.defaultValue)) {
      const getter = function () {
        if (!isNoU(this['__' + key])) return this['__' + key];
        else return params.defaultValue;
      };

      const setter = function (next: any) {
        if (!isNoU(coercionSetter)) coercionSetter.call(this, next);
        else this['__' + key] = next;
      };

      Object.defineProperty(target, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true
      });
    }
  };
}
