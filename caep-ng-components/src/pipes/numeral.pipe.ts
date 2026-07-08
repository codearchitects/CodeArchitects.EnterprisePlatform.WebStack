import { Inject, InjectionToken, Pipe, PipeTransform } from '@angular/core';
import numeral from 'numeral';

export interface CaepNumeralJSLocale {
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

export type CaepRoundingFunction = (value: number) => number;

export interface CaepNumeralJsFormat {
  regexps: {
    format: RegExp;
    unformat: RegExp;
  };
  format: (value: any, format: string, roundingFunction: CaepRoundingFunction) => string;
  unformat: (value: string) => number;
}

export type CaepRegisterType = 'format' | 'locale';

export interface CaepNumeral {
  (value?: any): CaepNumeral;
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
  register(
    what: CaepRegisterType,
    key: string,
    value: CaepNumeralJSLocale | CaepNumeralJsFormat
  ): CaepNumeralJSLocale | CaepNumeralJsFormat;

  zeroFormat(format: string): void;
  nullFormat(format: string): void;
  defaultFormat(format: string): void;
  clone(): CaepNumeral;
  format(inputString?: string, roundingFunction?: CaepRoundingFunction): string;
  formatCurrency?(inputString?: string): string;
  unformat(inputString: string): number;
  value(): number;
  valueOf(): number;
  set(value: any): CaepNumeral;
  add(value: any): CaepNumeral;
  subtract(value: any): CaepNumeral;
  multiply(value: any): CaepNumeral;
  divide(value: any): CaepNumeral;
  difference(value: any): number;
  validate(value: any, culture: any): boolean;
}

export const CAEP_DEFAULT_NUMERAL = new InjectionToken<number>('DEFAULT_NUMERAL');

@Pipe({
    name: 'numeral',
    standalone: false
})
export class CaepNumeralPipe implements PipeTransform {
  private numeral: CaepNumeral;

  constructor(@Inject(CAEP_DEFAULT_NUMERAL) value?: string | number) {
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

  register(
    what: CaepRegisterType,
    key: string,
    value: CaepNumeralJSLocale | CaepNumeralJsFormat
  ): CaepNumeralJSLocale | CaepNumeralJsFormat {
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

  clone(): CaepNumeralPipe {
    return new CaepNumeralPipe(this.numeral.clone().value());
  }

  format(inputString?: string, roundingFunction?: CaepRoundingFunction): string {
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
