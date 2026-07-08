import { Pipe, PipeTransform, Inject, InjectionToken } from "@angular/core";
import numeral from "numeral";

export interface NumeralJSLocale {
  delimiters: {
      thousands: string;
      decimal: string;
  };
  abbreviations: {
      thousand: string;
      million: string;
      billion: string;
      trillion: string;
  };
  ordinal(num: number): string;
  currency: {
      symbol: string;
  };
}

export type RoundingFunction = (value: number) => number;

export interface NumeralJsFormat {
  regexps: {
      format: RegExp,
      unformat: RegExp,
  };
  format: (value: any, format: string, roundingFunction: RoundingFunction) => string;
  unformat: (value: string) => number;
}

export type RegisterType = "format" | "locale";

export interface Numeral {
  (value?: any): Numeral;
  version: string;
  isNumeral: boolean;

/**
 * This function sets the current locale.  If no arguments are passed in,
 * it will simply return the current global locale key.
 */
  locale(key?: string): string;

/**
 * Registers a language definition or a custom format definition.
 *
 * @param what Allowed values are: either 'format' or 'locale'
 * @param key The key of the registerd type, e.g. 'de' for a german locale definition
 * @param value The locale definition or the format definitiion
 */
  register(what: RegisterType, key: string, value: NumeralJSLocale | NumeralJsFormat): NumeralJSLocale | NumeralJsFormat;

  zeroFormat(format: string): void;
  nullFormat(format: string): void;
  defaultFormat(format: string): void;
  clone(): Numeral;
  format(inputString?: string, roundingFunction?: RoundingFunction): string;
  formatCurrency?(inputString?: string): string;
  unformat(inputString: string): number;
  value(): number;
  valueOf(): number;
  set(value: any): Numeral;
  add(value: any): Numeral;
  subtract(value: any): Numeral;
  multiply(value: any): Numeral;
  divide(value: any): Numeral;
  difference(value: any): number;
  validate(value: any, culture: any): boolean;
}

export const DEFAULT_NUMERAL = new InjectionToken<number>("DEFAULT_NUMERAL");

@Pipe({
    name: "numeral",
    standalone: false
})
export class NumeralPipe implements PipeTransform {
    private numeral: Numeral;

    constructor( @Inject(DEFAULT_NUMERAL) value?: string | number) {
        this.numeral = numeral(value);
    }

    transform(value: number, format: string): string {
        return numeral(value).format(format);
    }

    get version(): string {
        return this.numeral.version;
    }

    get isNumeral(): boolean {
        return this.numeral.isNumeral;
    }

    locale(key?: string): string {
        return this.numeral.locale(key);
    }

    register(what: RegisterType, key: string, value: NumeralJSLocale | NumeralJsFormat): NumeralJSLocale | NumeralJsFormat {
        return this.numeral.register(what, key, value);
    }

    zeroFormat(format: string): void {
        return this.numeral.zeroFormat(format);
    }

    nullFormat(format: string): void {
        return this.numeral.nullFormat(format);
    }

    defaultFormat(format: string): void {
        return this.numeral.defaultFormat(format);
    }

    clone(): NumeralPipe {
        return new NumeralPipe(this.numeral.clone().value());
    }

    format(inputString?: string, roundingFunction?: RoundingFunction): string {
        return this.numeral.format(inputString, roundingFunction);
    }

    formatCurrency(inputString?: string): string {
        return this.numeral.formatCurrency(inputString);
    }

    unformat(inputString: string): number {
        return this.numeral.unformat(inputString);
    }

    value(): number {
        return this.numeral.value();
    }

    valueOf(): number {
        return this.numeral.valueOf();
    }

    set(value: any): this {
        this.numeral.set(value);
        return this;
    }

    add(value: any): this {
        this.numeral.add(value);
        return this;
    }

    subtract(value: any): this {
        this.numeral.subtract(value);
        return this;
    }

    multiply(value: any): this {
        this.numeral.multiply(value);
        return this;
    }

    divide(value: any): this {
        this.numeral.divide(value);
        return this;
    }

    difference(value: any): number {
        return this.numeral.difference(value);
    }

    validate(value: any, culture: any): boolean {
        return this.numeral.validate(value, culture);
    }
}
