import { coerceBooleanProperty, coerceCssPixelValue, coerceNumberProperty } from '@angular/cdk/coercion';

/**
 * Decorator useful to allow coercion for a boolean input property, so this one can be valued by any type of value and coerced to a boolean value.
 * <my-component [enable]="booleanValue"></my-component>  or  <my-component [enable]="true"></my-component>  or  <my-component [enable]="obj"></my-component>  or
 * <my-component enable="true"></my-component>  or  <my-component [enable]="1"></my-component>  or  <my-component enable="0"></my-component>  or  <my-component enable></my-component>
 *
 *
 * ### Example
 * ```
 * @Input()
 * @CaepCoerceBoolean()
 * public enable: any = false;
 * ```
 */
export function CaepCoerceBoolean() {
  return function (target: any, key: string): void {
    const getter = function () {
      return this['__' + key];
    };

    const setter = function (next: any) {
      this['__' + key] = coerceBooleanProperty(next);
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  };
}

/**
 * Decorator useful to allow coercion for a css pixel input property, so this one can be valued by number or string and coerced to a correct css pixel value.
 * <my-component [padding]="padding"></my-component>  or  <my-component [width]="500"></my-component>  or  <my-component [width]="'500px'"></my-component>  or  <my-component [width]="'30%'"></my-component>  or
 * <my-component [padding]="'1em'"></my-component>
 *
 *
 * ### Example
 * ```
 * @Input()
 * @CaepCoerceCssPixel()
 * public width?: string | number;
 * ```
 */
export function CaepCoerceCssPixel() {
  return function (target: any, key: string): void {
    const getter = function () {
      return this['__' + key];
    };

    const setter = function (next: any) {
      this['__' + key] = coerceCssPixelValue(next);
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  };
}

/**
 * Decorator useful to allow coercion for a number input property, so this one can be valued by string and coerced to a correct number value.
 * <my-component [tabindex]="tabindex"></my-component>  or  <my-component [tabindex]="0"></my-component>  or  <my-component tabindex="0"></my-component>
 *
 *
 * ### Example
 * ```
 * @Input()
 * @CaepCoerceNumber()
 * public tabindex?: string | number;
 * ```
 */
export function CaepCoerceNumber() {
  return function (target: any, key: string): void {
    const getter = function () {
      return this['__' + key];
    };

    const setter = function (next: any) {
      this['__' + key] = coerceNumberProperty(next);
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  };
}

/**
 * Decorator useful to allow coercion for a string input property, so this one can be valued by string array coerced to a sequence of strings.
 * <my-component [inpuClass]="inputClassArray"></my-component>  or  <my-component tabindex="my-class1 my-class2"></my-component>
 *
 *
 * ### Example
 * ```
 * @Input()
 * @CaepCoerceArrayString()
 * public inpuClass?: string | string[];
 * ```
 */
export function CaepCoerceArrayString() {
  return function (target: any, key: string) {
    const getter = function () {
      return this['__' + key];
    };

    const setter = function (next: any) {
      this['__' + key] = next instanceof Array ? next.join(' ') : next;
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  };
}
