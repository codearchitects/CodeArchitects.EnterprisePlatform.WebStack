import { isObject } from 'lodash';
import moment from 'moment';
import numeral from 'numeral';
import { Empty } from './constants';
import { CompareMethod, DateInterval, FirstDayOfWeek, FirstWeekOfYear, VbStrConv } from './enumerators';
import { IVB6Error, VB6Error } from './error';
import { FormatError, IndexOutOfRangeError, InvalidProcedureCallOrArgumentError, InvalidUseOfNullError, NotSupportedError, OverflowError, TypeMismatchError } from './error.types';
import { MsgBoxResult, MsgBoxStyle, VB6Objects } from './models';
import { IRef } from './ref';
import { createNDimArray, getArrayRank, getUpdatedArray, isDateValid } from './utils';

interface IVB6Helpers {
  /**
   * Returns a value of the same type that is passed to it specifying the absolute value of a number.
   */
  Abs<T = any>(v: T): number;
  /**
   * Navigate to home (???)
   */
  ApplicationExit(component: any): void;
  /**
   * Returns a Variant containing an array
   */
  Array<T = any>(...args: T[]): T[];
  /**
   * Returns an Integer representing the character code corresponding to the first letter in a string.
   */
  Asc(value: string): number;
  /**
   * Emits a beep sound.
   */
  Beep(): void;
  /**
   * Returns an expression that has been converted to a Variant of subtype Boolean.
   */
  CBool<T = any>(v: T): boolean;
  /**
   * Returns an expression that has been converted to a Variant of subtype Byte.
   */
  CByte<T = any>(value: T): number[];
  /**
   * Returns an expression that has been converted to a Variant of subtype Date.
   */
  CDate<T = any>(v: T): Date;
  /**
   * Returns an expression that has been converted to a Variant of subtype Double.
   */
  CDbl<T = any>(v: T): number;
  /**
   * Returns an expression that has been converted to a Variant of subtype Decimal.
   */
  CDec<T = any>(v: T): number;
  /**
   * Selects and returns a value from a list of arguments.
   * IMPORTANT: 1-based indexing
   */
  Choose<T = any>(index: number, ...choice: Array<T>): T;
  /**
   * Returns a String containing the character associated with the specified character code.
   */
  Chr(charCode: number): string;
  /**
   * Returns an expression that has been converted to a Variant of subtype Integer.
   */
  CInt<T = any>(v: T): number;
  /**
   * Clears errors
   */
  ClearError(): void;
  /**
   * Clipboard object
   */
  readonly Clipboard: {
    /**
     * Clears clipboard data
     */
    Clear(): void;
    /**
     * Sets clipboard text
     * IMPORTANT: format not handled
     */
    SetText(str: string, format?: number): void;
    /**
     * Retrieves clipboard text
     * IMPORTANT: format not handled
     */
    GetText(format?: number): Promise<string>;
  };
  /**
   * Clones array
   */
  CloneArray<T = any>(arr: T[], deepCloning?: boolean): T[];
  /**
   * Instantiate a registered object
   */
  CreateObject<T = any>(name: string, server?: string): T;
  /**
   * Returns an expression that has been converted to a Variant of subtype Short.
   */
  CShort<T = any>(v: T): number;
  /**
   * Returns an expression that has been converted to a Variant of subtype Single.
   */
  CSng<T = any>(v: T): number;
  /**
   * Returns an expression that has been converted to a Variant of subtype String.
   */
  CStr<T = any>(v: T extends Date ? never : T): string;
  DateAdd(interval: DateInterval | string, number: number, dateValue: any): Date;
  // NOTES: firstDayOfWeek e firstWeekOfYear non usati
  DateDiff(interval: DateInterval | string, date1: any, date2: any, firstDayOfWeek?: FirstDayOfWeek | number, firstWeekOfYear?: FirstWeekOfYear | number): number;
  DateToDouble(value: Date): number;
  DateSerial(year: number, month: number, day: number): Date;
  Day(value: Date): number;
  // NOTES: da implementare?
  // Si usa in due casi: per riempire una listbox o per testare se un file esiste
  Dir(...args: any[]): any;
  // NOTES: da implementare?
  DoEvents(milliseconds?: number): Generator;
  DoubleToDate(value: number): Date;
  readonly Empty: any;
  // NOTES: da implementare?
  Environ(expression: string): any;
  // NOTES: da implementare?
  EOF(fileNumber: number): any;
  // NOTES: da implementare?
  Erase(...args: any[]): any;
  // tslint:disable-next-line: member-ordering
  Err: IVB6Error;
  // NOTES: da implementare?
  FileClose(...args: any[]): any;
  // NOTES: da implementare?
  FileCopy(...args: any[]): any;
  // NOTES: da implementare?
  FileGetArray(...args: any[]): any;
  // NOTES: da implementare?
  FileInputString(...args: any[]): any;
  // NOTES: da implementare?r;
  FileLineInput(...args: any[]): any;
  // NOTES: da implementare?ever;
  FileOpen(...args: any[]): any;
  // NOTES: da implementare?
  FilePrintLine(...args: any[]): any;
  // NOTES: da implementare?never;
  FilePut(...args: any[]): any;
  // NOTES: da implementare?
  FileWriteLine(...args: any[]): any;
  Fix<T = any>(expression: T): number;
  // NOTES: da implementare?
  FontChangeName(...args: any[]): any;
  Format<T = any>(expression: T, formatString?: string, firstDayOfWeek?: FirstDayOfWeek, firstWeekOfYear?: FirstWeekOfYear, expressionType?: 'number' | 'string' | 'date', locale?: string): string;
  // NOTES: da implementare?
  FreeFile(...args: any[]): any;
  // NOTES: da implementare?
  FromOleColor(...args: any[]): any;
  // NOTES: da implementare?
  GetObject(...args: any[]): any;
  IIf<TTrue = any, TFalse = any>(expression: boolean, truePart: TTrue, falsePart: TFalse): TTrue | TFalse;
  InputBox(prompt: string, title?: string, placeholder?: string, ...deprecatedParams: any[]): string;
  // NOTES: 1-based start indexing and 1-based result
  Instr(start: number, string1: string, string2?: string, compare?: CompareMethod): number;
  Instr(string1: string, string2?: string, compare?: CompareMethod): number;
  // NOTES: non funziona
  InstrRev(stringCheck: string, stringMatch: string, start?: number, compare?: CompareMethod): number;
  Int<T = any>(expression: T): number;
  // NOTES: da implementare?
  Invoke(...args: any[]): any;
  IsArray<T = any>(expression: T);
  IsDate<T = any>(expression: T);
  IsEmpty<T = any>(expression: T);
  // NOTES: copriamo tutti i casi?
  IsMissing<T = any>(expression: T);
  // NOTES: ora copriamo sia null che undefined. è corretto?
  IsNull<T = any>(expression: T);
  IsNumeric<T = any>(expression: T);
  Join(sourceArray: string[], delimiter?: string): string;
  // NOTES: need more clarifications
  LBound<T = any>(arr: T, rank?: number);
  LCase<T = string>(string: T): string;
  Left<T = string>(string: T, length: number | boolean): string;
  Len<T>(value: T): number;
  // NOTES: need more clarifications
  Like<T = any>(...args: T[]): any;
  // NOTES: impossible
  LoadForm(...args: any): any;
  // NOTES: da implementare?
  LOF(...args: any[]): any;
  // NOTES: 1-based indexing for start and length
  Mid(string: string, start: number, length?: number): string;
  // NOTES: 1-based indexing for start and length
  MidSet(variable: string, start: number, valueOrLength: number | string, value?: string): string;
  // NOTES: da implementare?
  MkDir(...args: any[]): any;
  Month(value: Date): number;
  // NOTES: alcuni stili non usati
  MsgBox(prompt: string, style?: MsgBoxStyle, title?: string): MsgBoxResult;
  Randomize(value?: number): number;
  Redim(arr: IRef<any>, ...args: any[]);
  RedimPreserve(arr: IRef<any>, ...args: any[]);
  /**
   * Registers a new object to be instantiated
   * @param name Object key
   * @param func Object factory
   */
  RegisterObject<T = any>(name: string, func: () => T);
  // NOTES: Compare not handled and start 1-based
  Replace(expression: string, find: string, replaceStr: string, start?: number, count?: number, compare?: CompareMethod): string;
  Right<T = string>(string: T, length: number | boolean): string;
  Rnd(): number;
  Round<T = number>(expression: T, numDecimalPlaces?: number): number;
  // NOTES: funzione non trovata
  Set(...args: any[]): any;
  // NOTES: da implementare?
  SetError(exception: any): any;
  // NOTES: da implementare?
  Shell(pathname: string): any;
  Sleep(delay: number): void;
  Space(count: number): string;
  Split(expression: string, delimiter?: string, limit?: number, compare?: CompareMethod): string[];
  Str<T = any>(expression: T): string;
  // NOTES: compare not used
  StrComp<T = any>(string1: T, string2: T, compare?: CompareMethod): number;
  StrConv<T = any>(value: T, conversion: VbStrConv, localeID?: number): any;
  String<T = any>(number: number, character: T): string;
  StringToByteArray<T = any>(expression: T): number[];
  ToOleColor(...args: any): any;
  Trim<T = any>(expression: T): string;
  TypeName<T = any>(expression: T): string;
  // NOTES: need more clarifications
  UBound<T = any>(arr: T, rank?: number): any;
  UCase<T = string>(string: T): string;
  Unload: (component: IActionShellComponent, command?: string, ...params: any[]) => void;
  Val<T = any>(value: T): number;
  Year(value: Date): number;
  // tslint:disable-next-line: member-ordering
  readonly ObjectError: number;
  LastException: Error | IVB6Error;
  LastErrorNumber: number;
  LastErrorDescription: string;
}

export interface IActionShellComponent<TPayload = any, TRouter = any> {
  [key: string]: any;
  /**
   * Current payload
   */
  readonly payload: TPayload;
  /**
   * Navigation provider
   */
  router: TRouter;
  /**
   * dispatches a command to route
   * @param command command to dispatch
   * @param params parameters of command
   */
  command(command: string, ...params: Array<any>): void;
  /**
   * returns to originator of this flow
   * @param output output informations
   */
  return(...output: any[]): void;
}

export const VB6Helpers: IVB6Helpers = {
  Abs: <T = any>(v: T) => {
    if (typeof v === 'boolean') {
      return Math.abs(VB6Helpers.CInt(v));
    } else if (typeof v === 'string') {
      if (v.trim() === '') {
        throw new FormatError();
      }
      return Math.abs(VB6Helpers.CDbl(v));
    } else if (v == null) {
      return 0;
    } else if (typeof v === 'number') {
      return Math.abs(v);
    }
    throw new TypeMismatchError();
  },
  ApplicationExit: (component: any) => {
    component.router.navigate(['/']);
  },
  Array: <T = any>(...args: T[]) => {
    return [...args];
  },
  Asc: (value: string): number => {
    if (value === '') {
      throw new InvalidProcedureCallOrArgumentError();
    } else if (value === 'true') {
      return 84;
    } else if (value === 'false') {
      return 70;
    } else if (value == null) {
      throw new InvalidUseOfNullError();
    } else {
      return value.charCodeAt(0);
    }
  },
  Beep: () => {
    const beep = new Audio('data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=');
    beep.play();
  },
  CBool: <T = any>(v: T) => {
    if (typeof v === 'string' && isNaN(v as any)) {
      throw new FormatError();
    }
    return !!v;
  },
  CByte: <T = any>(value: T) => {
    const stringToBytes = (source: string) => {
      const bytes: number[] = [];
      for (let i = 0; i < source.length; i++) {
        bytes.push(source.charCodeAt(i));
      }
      return bytes;
    };
    const toBytes = <TValue = any>(source: TValue) => {
      const bytes = [];
      if (isObject(source)) {
        // tslint:disable-next-line: forin
        for (const key in source) {
          const val = source[key];
          if (typeof val === 'string') {
            bytes.push(...stringToBytes(val));
          } else if (typeof val === 'number') {
            bytes.push(...stringToBytes(String.fromCharCode(val)));
          } else if (isObject(val)) {
            bytes.push(...toBytes(val));
          }
        }
      } else if (typeof source === 'string') {
        bytes.push(...stringToBytes(source));
      }
      return bytes;
    };
    return toBytes(value);
  },
  CDate: <T = any>(value: T) => {
    let retVal: Date;
    if (value === null) {
      return null;
    } else if ((value as any) === 0 || value === undefined || (value as any) === false) {
      return new Date(0, 0, 0, 12, 0, 0, 0);
    } else if ((value as any) === -1 || (value as any) === true) {
      return new Date(1899, 11, 29);
    } else if (typeof value === 'string') {
      const dateSeparator = value.indexOf('/') !== -1 ? '/' : value.indexOf('-') !== -1 ? '-' : ' ';
      // let date = value as string;
      // const dateMembers = value.split(/[\W]/g);
      // if (value.indexOf(dateSeparator) !== 4) { // check if date isn't invariant
      //   if (isMDY) {
      //     date = `${dateMembers[2]}/${dateMembers[0]}/${dateMembers[1]}`;
      //   } else {
      //     date = `${dateMembers[2]}/${dateMembers[1]}/${dateMembers[0]}`;
      //   }
      //   if (dateMembers.length > 3) { // check if date has also time
      //     date = `${date} ${dateMembers[3]}:${dateMembers[4] || '00'}:${dateMembers[5] || '00'}${dateMembers[6] ? ` ${dateMembers[6]}` : ''}`;
      //   }
      // }
      // retVal = moment(date).toDate();
      // if (!isDateValid(retVal)) {
      //   retVal = undefined;
      // }
      if (value.indexOf(dateSeparator) !== 4) {
        retVal = moment(value, 'DD/MM/YYYY HH:mm:ss').toDate();
      } else {
        retVal = moment(value, 'YYYY/MM/DD HH:mm:ss').toDate();
      }
      if (!isDateValid(retVal)) {
        retVal = undefined;
      }
    }
    if (!retVal) {
      retVal = new Date(<any>value);
      if (!isDateValid(retVal)) {
        throw new TypeMismatchError();
      }
    }
    return retVal;
  },
  CDbl: <T = any>(v: T) => {
    if (v == null) {
      throw new TypeMismatchError();
    } else if (typeof v === 'boolean') {
      return v ? -1 : 0;
    } else {
      if (typeof v === 'string') {
        let retVal = +v as any;
        if (isNaN(retVal)) {
          retVal = numeral(v).value() as any;
          if (retVal == null) {
            throw new TypeMismatchError();
          }
        }
        v = retVal;
      }
      return parseFloat(<any>v);
    }
  },
  CDec: <T = any>(v: T) => {
    if (v == null) {
      return 0;
    }
    return VB6Helpers.CDbl(v);
  },
  Choose: <T = any>(index: number, ...choice: Array<T>) => {
    if (typeof index === 'number') {
      index = Math.round(index);
    } else if (typeof index === 'string') {
      if (isNaN(index)) {
        throw new FormatError();
      } else {
        index = Math.round(index);
      }
    } else if (index == null) {
      index = 0;
    } else if (typeof index === 'boolean') {
      if (index) {
        throw new IndexOutOfRangeError();
      } else {
        index = 0;
      }
    }
    if (index < 0 || index > choice.length - 1) {
      throw new IndexOutOfRangeError;
    }
    return choice[index];
  },
  Chr: (charCode: number) => {
    if (charCode === 0 || (charCode as any) === false) {
      return '';
    } else if (charCode > 255 || (charCode as any) === true) {
      throw new InvalidProcedureCallOrArgumentError();
    } else if (charCode == null) {
      throw new InvalidUseOfNullError();
    } else if (typeof charCode === 'number') {
      charCode = Math.round(charCode);
    }
    return String.fromCharCode(charCode);
  },
  CInt: <T = any>(v: T) => {
    if (v == null) {
      return 0;
    } else if (typeof v === 'boolean') {
      return v ? -1 : 0;
    } else {
      if (typeof v === 'string') {
        v = +v as any;
        if (isNaN(v as any)) {
          throw new TypeMismatchError();
        }
      }
      if ((<any>v) >= -2147483648 && (<any>v) <= 2147483647) {
        v = Math.round(v as any) as any;
        return parseInt(<any>v);
      } else {
        throw new OverflowError('-2147483648 to 2147483647');
      }
    }
  },
  ClearError: () => {
    VB6Error.Clear();
  },
  Clipboard: {
    Clear: () => {
      const dummy = document.createElement("input");
      dummy.style.cssText = "width:0!important;padding:0!important;border:0!important;margin:0!important;outline:none!important;boxShadow:none!important;";
      document.body.appendChild(dummy);
      dummy.value = ' ';
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
    },
    /**
     * NOTES: format not handled
     */
    SetText: (str: string, format = -1) => {
      if (!str) {
        VB6Helpers.Clipboard.Clear();
      } else {
        navigator.clipboard.writeText(str);
      }
    },
    /**
     * NOTES: format not handled
     */
    GetText: (format = -1) => {
      return navigator.clipboard.readText();
    }
  },
  CloneArray: <T = any>(arr: Array<T>, deepCloning = false) => {
    let retval: Array<T>;
    if (!deepCloning) {
      retval = [...arr];
    } else {
      retval = JSON.parse(JSON.stringify(arr));
    }
    return retval;
  },
  CreateObject<T = any>(name: string, server?: string) {
    if (VB6Objects[name]) {
      return VB6Objects[name]();
    }
    console.error(`No registered object for ${name}`);
    return {} as T;
  },
  CShort: <T = any>(v: T) => {
    if (v == null) {
      return 0;
    } else if (typeof v === 'boolean') {
      return v ? -1 : 0;
    } else {
      if (typeof v === 'string') {
        v = +v as any;
        if (isNaN(v as any)) {
          throw new TypeMismatchError();
        }
      }
      if ((<any>v) >= -32768 && (<any>v) <= 32767) {
        v = Math.round(v as any) as any;
        return parseInt(<any>v);
      } else {
        throw new OverflowError('-32768 to 32767');
      }
    }
  },
  CSng: <T = any>(v: T) => {
    if (v == null) {
      return 0;
    }
    return VB6Helpers.CDbl(v);
  },
  CStr: <T = any>(v: T extends Date ? never : T) => {
    if (v == null) {
      return null;
    } else if (v instanceof Date) {
      return v.toISOString();
    } else if (typeof v === "number") {
      const locale = numeral.locale();
      return v.toLocaleString(locale, { useGrouping: false });
    }
    return v.toString();
  },
  DateAdd: (interval: DateInterval | string, number: number, dateValue: any) => {
    if (isNaN(Date.parse(dateValue))) {
      throw new FormatError();
    }
    let newDateValue = new Date(Date.parse(dateValue));
    let num = Math.trunc(number);
    switch (interval) {
      case DateInterval.Second:
      case 's':
      case 'S':
        newDateValue.setSeconds(newDateValue.getSeconds() + num);
        break;
      case DateInterval.Minute:
      case 'n':
      case 'N':
        newDateValue.setMinutes(newDateValue.getMinutes() + num);
        break;
      case DateInterval.Hour:
      case 'h':
      case 'H':
        newDateValue.setHours(newDateValue.getHours() + num);
        break;
      case DateInterval.WeekOfYear:
      case 'ww':
      case 'WW':
        num *= 7;
      case DateInterval.Weekday:
      case DateInterval.DayOfYear:
      case DateInterval.Day:
      case 'd':
      case 'D':
      case 'w':
      case 'W':
      case 'y':
      case 'Y':
        newDateValue.setDate(newDateValue.getDate() + num);
        break;
      case DateInterval.Quarter:
      case 'q':
      case 'Q':
        num *= 3
      case DateInterval.Month:
      case 'm':
      case 'M':
        newDateValue = addMonths(newDateValue, num);
        break;
      case DateInterval.Year:
      case 'yyyy':
      case 'YYYY':
        newDateValue.setFullYear(newDateValue.getFullYear() + num);
        break;
      default:
        console.error('Not yet implemented');
    }
    return newDateValue;
  },
  DateDiff: (interval: DateInterval | string, date1: any, date2: any, firstDayOfWeek: number | FirstDayOfWeek = FirstDayOfWeek.Sunday, firstWeekOfYear: number | FirstWeekOfYear = FirstWeekOfYear.Jan1) => {
    const moment1 = moment(date1);
    let moment2 = moment(date2);
    if (!moment1.isValid || !moment2.isValid) {
      throw new FormatError;
    }
    let momentInterval: moment.unitOfTime.Base | moment.unitOfTime.Diff;
    switch (interval) {
      case DateInterval.Second:
      case 's':
      case 'S':
        momentInterval = 'seconds';
        break;
      case DateInterval.Minute:
      case 'n':
      case 'N':
        momentInterval = 'minutes';
        break;
      case DateInterval.Hour:
        momentInterval = 'hours';
        break;
      case DateInterval.DayOfYear:
      case DateInterval.Weekday:
      case DateInterval.Day:
      case 'd':
      case 'D':
        momentInterval = 'days';
        break;
      case DateInterval.Month:
      case 'm':
      case 'M':
        moment2.set('date', moment1.get('date'))
        momentInterval = 'months';
        break;
      case DateInterval.Year:
      case 'yyyy':
      case 'YYYY':
        moment2.set('date', moment1.get('date'))
        moment2.set('month', moment1.get('month'))
        momentInterval = 'years';
        break;
      case DateInterval.Quarter:
        momentInterval = 'quarters';
        break;
      case DateInterval.WeekOfYear:
      case 'w':
        momentInterval = 'weeks';
        break;
      default:
        console.error('Not yet implemented');
    }
    return moment2.diff(moment1, momentInterval);

    // const diff = Math.floor(date2.getTime() - date1.getTime());
    // const day = 1000 * 60 * 60 * 24;

    // const days = Math.floor(diff / day);
    // const seconds = Math.floor(days * 24 * 60 * 60);
    // const minutes = Math.floor(seconds / 60);
    // const hours = Math.floor(minutes / 60);
    // const months = Math.floor(days / 31);
    // const years = Math.floor(months / 12);

    // switch (interval) {
    //     case DateInterval.Second:
    //         return seconds;
    //     case DateInterval.Minute:
    //         return minutes;
    //     case DateInterval.Hour:
    //         return hours;
    //     case DateInterval.Day:
    //         return days;
    //     case DateInterval.Month:
    //         return months;
    //     case DateInterval.Year:
    //         return years;
    //     case DateInterval.DayOfYear:
    //     case DateInterval.Quarter:
    //     case DateInterval.WeekOfYear:
    //     case DateInterval.Weekday:
    //     default:
    //         console.error('Not yet implemented');
    // }

  },
  DateToDouble: (value: Date) => {
    // 30 december 1899
    const oaDate = '1899/12/30';
    const diff = Date.parse(value.toLocaleDateString('en')) - Date.parse(oaDate);
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    return value ? Math.round(diff / millisecondsPerDay) : null;
  },
  DateSerial: (year: number, month: number, day: number) => {
    if (year > 9999) {
      throw new InvalidProcedureCallOrArgumentError();
    }
    if (year < 0) {
      year = new Date().getFullYear() + year;
    }
    return new Date(year, month - 1, day);
  },
  Day: (value: Date) => {
    return value != null ? value.getDate() : 1;
  },
  // NOTES: da implementare?
  // Si usa in due casi: per riempire una listbox o per testare se un file esiste
  Dir: (...args: any[]) => {
    console.error('Not yet implemented');
  },
  // NOTES: da CAPIRE?
  DoEvents: (function* (milliseconds?: number) {
    const events = [() => 0, () => 2, () => 4];
    while (events.length > 0) {
      const event = events.shift();
      if (event) {
        yield event();
      }
    }
  }),
  DoubleToDate: (value: number) => {
    // 30 december 1899
    const oaDate = '1899/12/30';
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    let result = new Date();
    result.setTime((value * millisecondsPerDay) + Date.parse(oaDate));
    return new Date(result.toLocaleDateString('en'));
  },
  Empty: Empty,
  // NOTES: da implementare?
  Environ: (expression: string) => {
    console.error('Not yet implemented');
  },
  // NOTES: da implementare?
  EOF: (fileNumber: number) => {
    console.error('Not yet implemented');
  },
  // NOTES: da implementare?
  Erase: () => {
    console.error('Not yet implemented');
  },
  Err: VB6Error,
  // NOTES: da implementare?
  FileClose: () => {
    console.error('Not yet implemented');
  },
  // NOTES: da implementare?
  FileCopy: () => {
    console.error('Not yet implemented');
  },
  // NOTES: da implementare?
  FileGetArray: () => {
    console.error('Not yet implemented');
  },
  // NOTES: da implementare?
  FileInputString: () => {
    console.error('Not yet implemented');
  },
  // NOTES: da implementare?
  FileLineInput: () => {
    console.error('Not yet implemented');
  },
  // NOTES: da implementare?
  FileOpen: () => {
    console.error('Not yet implemented');
  },
  // NOTES: da implementare?
  FilePrintLine: () => {
    console.error('Not yet implemented');
  },
  // NOTES: da implementare?
  FilePut: () => {
    console.error('Not yet implemented');
  },
  // NOTES: da implementare?
  FileWriteLine: () => {
    console.error('Not yet implemented');
  },
  Fix: <T = any>(expression: T) => {
    if (typeof expression === 'number') {
      // tslint:disable-next-line: radix
      return Math.trunc(expression);
    } else if (typeof expression === 'boolean') {
      return expression ? 1 : 0;
    } else if (typeof expression === 'string') {
      const converted = Math.trunc(expression as any);
      if (isNaN(converted)) {
        throw new TypeMismatchError;
      } else {
        return converted;
      }
      // tslint:disable-next-line: curly
    } else if (expression === null) {
      return null;
    }
    return 0;
  },
  // NOTES: da implementare?
  FontChangeName: () => {
    console.error('Not yet implemented');
  },
  Format: <T = any>(expression: T, formatString?: string, firstDayOfWeek = FirstDayOfWeek.System, firstWeekOfYear = FirstWeekOfYear.System, expressionType?: 'number' | 'string' | 'date', locale?: string) => {
    if (expressionType === "number" || typeof expression === 'number') {
      let defaultLocale;
      if (locale) {
        defaultLocale = numeral.locale();
        numeral.locale(locale);
      }
      const retval = numeral(expression).format(formatString);
      if (defaultLocale) {
        numeral.locale(defaultLocale);
      }
      return retval;
    } else if (typeof expression === 'string') {
      if (expression == null || expression.trim() === '') {
        return null;
      }
      let result = '';
      if (formatString) {
        switch (formatString) {
          case '<':
            result = expression.toLowerCase();
            break;
          case '>':
            result = expression.toUpperCase();
            break;
          case '@':
            // spazi a destra
            break;
          case '!':
            // spazi a sinistra
            break;
          default:
            let dateValue: moment.Moment;
            const dateSeparator = expression.indexOf('/') !== -1 ? '/' : expression.indexOf('-') !== -1 ? '-' : ' ';
            if (expression.indexOf(dateSeparator) !== 4) {
              dateValue = moment(VB6Helpers.CDate(expression), 'DD/MM/YYYY HH:mm:ss');
            } else {
              dateValue = moment(expression, 'YYYY/MM/DD HH:mm:ss');
            }
            if (dateValue.isValid()) {
              // date string in en format
              result = dateValue.format(formatString);
            } /*else {
              // date string in it format
              const date = expression.split(dateSeparator);
              const enDate = `${date[1]}/${date[0]}/${date[2]}`;
              dateValue = moment(enDate);
              if (dateValue.isValid()) {
                result = dateValue.format(formatString);
              }
            }*/
            break;
        }
      } else {
        // @ come per il sharp ma per i caratteri non per le cifre
        // NOTES: TODO gestire @,&,!
        console.error('Not yet implemented');
      }
      return result;
    } else if (expression instanceof Date) {
      // NOTES: TODO gestire format vB6
      // https://docs.microsoft.com/en-us/office/vba/language/reference/user-interface-help/format-function-visual-basic-for-applications
      return moment(expression).format(formatString);
    }
  },
  // NOTES: da implementare?
  FreeFile: (...args: any) => {
    console.error('Not yet implemented');
  },
  // NOTES: da implementare?
  FromOleColor: (...args: any) => {
    console.error('Not yet implemented');
  },
  // NOTES: da implementare?
  GetObject: (...args: any) => {
    console.error('Not yet implemented');
  },
  IIf: <TTrue = any, TFalse = any>(expression: boolean, truePart: TTrue, falsePart: TFalse) => {
    return expression ? truePart : falsePart;
  },
  InputBox: (prompt: string, title?: string, placeholder?: string, ...deprecatedParams: any[]) => {
    return window.prompt(`${title ? title + ': ' : ''}${prompt}`, placeholder);
  },
  // NOTES: 1-based start indexing and 1-based result
  Instr: ((startOrString1: number | string, string1OrString2: string, string2OrCompare?: string | CompareMethod, compare?: CompareMethod) => {
    try {
      let start: number = -1;
      let string1: string;
      let string2: string;
      let compareMethod: CompareMethod;
      let retval = -1;
      if (typeof startOrString1 === 'number') {
        start = startOrString1 as number;
        string1 = string1OrString2;
        string2 = string2OrCompare as string;
        compareMethod = compare;
      } else {
        string1 = startOrString1 as string;
        string2 = string1OrString2 as string;
        compareMethod = string2OrCompare as CompareMethod;
      }

      if (startOrString1 == null) {
        return 0;
      }
      if (string1OrString2 == null) {
        return 1;
      }

      if (!string2.length) {
        return start;
      }

      if (compareMethod === CompareMethod.Text) {
        string1 = string1.toLocaleLowerCase();
        string2 = string2.toLocaleLowerCase();
      } if ((<any>compareMethod) === 2) {
        throw new Error('No implementation found for vbDatabaseCompare');
      }

      if (start > -1) {
        retval = string1.slice(start - 1).indexOf(string2);
        retval = retval > -1 ? retval + start - 1 : retval;
      } else {
        retval = string1.indexOf(string2);
      }

      return retval + 1;
    } catch (error) {
      throw new InvalidUseOfNullError;
    }
  }) as any,
  InstrRev: (stringCheck: string, stringMatch: string, start?: number, compare?: CompareMethod) => {
    try {
      if (stringCheck == null) {
        return 0;
      }
      if (stringMatch == null || !stringMatch.length) {
        return stringCheck.length;
      }

      let string1: string = start > -1 ? stringCheck.slice(0, start) : stringCheck;
      let string2: string = stringMatch;

      if (compare === CompareMethod.Text) {
        string1 = string1.toLocaleLowerCase();
        string2 = string2.toLocaleLowerCase();
      } else if ((<any>compare) === 2) {
        throw new Error('No implementation found for vbDatabaseCompare');
      }

      return string1.lastIndexOf(string2) + 1;
    } catch (error) {
      throw new InvalidUseOfNullError;
    }
  },
  Int: <T = any>(expression: T) => {
    if (typeof expression === 'number') {
      // tslint:disable-next-line: radix
      return Math.floor(expression);
    } else if (typeof expression === 'boolean') {
      return expression ? -1 : 0;
    } else if (typeof expression === 'string') {
      const converted = Math.floor(expression as any);
      if (isNaN(converted)) {
        throw new TypeMismatchError;
      } else {
        return converted;
      }
      // tslint:disable-next-line: curly
    } else if (expression === null) {
      return null;
    }
    return 0;
  },
  // NOTES: da implementare?
  Invoke: (...args: any) => {
    console.error('Not yet implemented');
  },
  IsArray: <T = any>(expression: T) => {
    return Array.isArray(expression);
  },
  IsDate: <T = any>(expression: T) => {
    return expression instanceof Date
      || (typeof expression === 'string'
        && moment(expression, ['DD/MM/YYYY', 'YYYY/MM/DD', 'MM/DD/YYYY']).isValid());
  },
  IsEmpty: <T = any>(expression: T) => {
    return expression === undefined;
  },
  // NOTES: copriamo tutti i casi?
  IsMissing: <T = any>(expression: T) => {
    return expression === undefined;
  },
  // NOTES: ora copriamo sia null che undefined. è corretto?
  IsNull: <T = any>(expression: T) => {
    return expression === null;
  },
  IsNumeric: <T = any>(expression: T) => {
    const type = typeof expression;

    const num = (type === 'string' && expression['length']) || type === 'boolean'
      ? +expression
      : expression;
    return typeof num === 'number' && !isNaN(num);
  },
  Join: (sourceArray: string[], delimiter = '') => {
    return sourceArray.join(delimiter);
  },
  // NOTES: need more clarifications
  LBound: <T = any>(arr: T, rank = 1) => {
    if (arr == null || !Array.isArray(arr)) {
      throw new InvalidProcedureCallOrArgumentError();
    }
    let temp = arr;
    while (rank > 1) {
      temp = temp[0];
      rank--;
    }
    if (Array.isArray(temp)) {
      return 0;
    } else {
      throw new IndexOutOfRangeError();
    }
  },
  LCase: <T = string>(string: T) => {
    if (string === undefined) {
      return '';
    } else if (string === null) {
      return null;
    } else {
      return `${string}`.toLowerCase();
    }
  },
  Left: <T = string>(string: T, length: number | boolean) => {
    if (length === -1 || length === true) {
      throw new InvalidProcedureCallOrArgumentError;
    } else if (length === null) {
      throw new InvalidUseOfNullError;
    } else if (string === null) {
      return null;
    } else if (length === false || string === undefined) {
      return '';
    }
    return `${string}`.slice(0, length);
  },
  Len: <T>(value: T) => {
    if (typeof value === 'string') {
      return value.length;
    } else if (typeof value === 'number') {
      // NOTES: In JS number type size is 8bytes
      return 2;
    } else if (typeof value === 'boolean') {
      // NOTES: need more clarifications
      return 4;
    } else if (value === null) {
      return null;
    } else if (value === undefined) {
      return 0;
    } else {
      throw new Error('Variable required');
    }
  },
  // NOTES: need more clarifications
  Like: <T = any>(...args: T[]) => {
    console.error('Not yet implemented');
  },
  // NOTES: impossible
  LoadForm: (...args: any) => {
    throw new Error('Navigate to specific form');
  },
  // NOTES: da implementare?
  LOF: (...args: any) => {
    console.error('Not yet implemented');
  },
  // NOTES: 1-based indexing for start and length
  Mid: (string: string, start: number, length?: number) => {
    if (start == null || length === null) {
      throw new InvalidUseOfNullError;
    } else if (typeof start === 'boolean') {
      throw new InvalidProcedureCallOrArgumentError;
    } else if (string === null) {
      return null;
    } else if (string === undefined) {
      return '';
    } else {
      start--;
      if (start <= -1) {
        return '';
      } else {
        return `${string}`.slice(start, length != null ? start + length : undefined);
      }
    }
  },
  // NOTES: 1-based indexing for start and length
  MidSet: (variable: string, start: number, valueOrLength: string | number, value?: string) => {
    if (variable == null || start < 1 || start > variable.length) {
      throw new InvalidProcedureCallOrArgumentError();
    }
    --start;
    if (typeof valueOrLength === 'string') {
      return (variable.substr(0, start) + valueOrLength + variable.substr(start + valueOrLength.length)).substr(0, variable.length)
    } else if (typeof valueOrLength === 'number') {
      return (variable.substr(0, start) + value.substr(0, valueOrLength) + variable.substr(start + valueOrLength)).substr(0, variable.length)
    }
  },
  // NOTES: da implementare?
  MkDir: (...args: any[]) => {
    console.error('Not yet implemented');
  },
  Month: (value: Date) => {
    return value == null
      ? value as any
      : value.getMonth() + 1;
  },
  // NOTES: alcuni stili non usati
  MsgBox: (prompt: string, style?: MsgBoxStyle, title?: string) => {
    let result: boolean;
    // const message = `${title ? title + ': ' : ''}${prompt}`;
    const message = `${prompt}`;
    if (style == null) {
      window.alert(message);
    } else {
      result = window.confirm(message);
    }
    switch (style) {
      case undefined:
      case null:
      case MsgBoxStyle.OkOnly:
      case MsgBoxStyle.DefaultButton1:
      case MsgBoxStyle.DefaultButton2:
      case MsgBoxStyle.DefaultButton3:
      case MsgBoxStyle.Critical:
      case MsgBoxStyle.Question:
      case MsgBoxStyle.Exclamation:
      case MsgBoxStyle.Information:
      case MsgBoxStyle.SystemModal:
      case MsgBoxStyle.MsgBoxSetForeground:
      case MsgBoxStyle.MsgBoxRight:
      case MsgBoxStyle.MsgBoxRtlReading:
        return MsgBoxResult.Ok;
      case MsgBoxStyle.OkCancel:
        return result ? MsgBoxResult.Ok : MsgBoxResult.Cancel;
      case MsgBoxStyle.YesNo:
        return result ? MsgBoxResult.Yes : MsgBoxResult.No;
      default:
        console.error(`${MsgBoxStyle[style]} Not handled`);
        return MsgBoxResult.Ok;
    }
  },
  Randomize: (value = 9999999999) => {
    return Math.floor(Math.random() * value);
  },
  Redim: (arr: IRef<any>, ...args: any[]) => {
    // next statement throws if argument is undefined
    // Even number of array bounds is required
    if (args.length === 0 || args.length % 2 !== 0) {
      throw new InvalidProcedureCallOrArgumentError();
    }

    for (let index = 0; index < args.length - 1; index += 2) {
      if (args[index] !== 0) {
        throw new InvalidProcedureCallOrArgumentError(); // Lower array bounds can only be zero
      }
    }

    // create arrays of lengths
    const lengths: number[] = new Array(Math.floor(args.length / 2) - 1)
    for (let index = 1; index < args.length; index += 2) {
      lengths[Math.floor(index / 2)] = args[index] + 1
    }
    arr.value = createNDimArray(lengths);
  },
  RedimPreserve: (arr: IRef<any>, ...args: any[]) => {
    // next statement throws if argument is undefined or if value in "arr" isn't an array
    // Even number of array bounds is required
    if (!Array.isArray(arr.value) || arr.value == null || args.length === 0 || args.length % 2 !== 0) {
      throw new InvalidProcedureCallOrArgumentError();
    }

    for (let index = 0; index < args.length - 1; index += 2) {
      if (args[index] !== 0) {
        throw new InvalidProcedureCallOrArgumentError(); // Lower array bounds can only be zero
      }
    }

    // create arrays of lengths
    const lengths: number[] = new Array(Math.floor(args.length / 2) - 1)
    for (let index = 1; index < args.length; index += 2) {
      lengths[Math.floor(index / 2)] = args[index] + 1
    }

    // Redim Preserve can't change the rank of an array
    if (getArrayRank(arr.value) !== lengths.length) {
      throw new InvalidProcedureCallOrArgumentError();
    }

    // Redim Preserve can change only the last index
    let temp = arr.value;
    for (let index = 0; index < lengths.length - 1; index++) {
      if (temp[0].length != lengths[index]) {
        throw new InvalidProcedureCallOrArgumentError();
      } else {
        temp = temp[0];
      }
    }
    arr.value = getUpdatedArray(arr.value, lengths[lengths.length - 1]); // change last dimension only
  },
  RegisterObject<T = any>(name: string, func: () => T) {
    VB6Objects[name] = func;
  },
  // NOTES: Compare not handled and start 1-based
  Replace: (expression: string, find: string, replaceStr: string, start = 1, count = -1, compare = CompareMethod.Binary) => {
    if (expression === null) {
      throw new InvalidUseOfNullError;
    }
    if (count === 0 || !find.length) {
      return expression;
    }
    if (start !== 1) {
      expression = expression.slice(--start, expression.length);
    }
    if (count > 0) {
      for (let acc = 0; acc < count; acc++) {
        expression = expression.replace(find, replaceStr);
      }
      return expression;
    }
    return expression.replace(new RegExp(find, 'g'), replaceStr);
  },
  Right: <T = string>(expression: T, length: number | boolean) => {
    if (length === -1 || length === true) {
      throw new InvalidProcedureCallOrArgumentError;
    } else if (length === null) {
      throw new InvalidUseOfNullError;
    } else if (expression === null) {
      return null;
    } else if (length === false || expression === undefined) {
      return '';
    }

    const string = `${expression}`;
    const strLength = string.length;
    return strLength > length ? string.slice(strLength - length, strLength) : string;
  },
  Rnd: () => {
    return Math.random();
  },
  Round: <T = number>(expression: T, numDecimalPlaces = 0) => {
    let value: number;
    if (expression == null) {
      return expression === undefined ? 0 : null;
    }
    if (typeof expression === 'string') {
      value = +expression;
    } else if (typeof expression === 'boolean') {
      return expression ? -1 : 0;
    } else {
      value = expression as unknown as number;
    }

    if (isNaN(value)) {
      throw new TypeMismatchError;
    }
    if (!numDecimalPlaces) {
      if (value % 1 === 0.5) {
        const integer = Math.trunc(value);
        if (integer % 2 === 0) {
          return integer;
        } else {
          return Math.round(value);
        }
      }
      return Math.round(value);
    } else {
      return +(value.toFixed(numDecimalPlaces));
    }
  },
  // NOTES: funzione non trovata
  Set: (...args: any[]) => {
    console.error('Not yet implemented');
  },
  SetError: (error: Error | IVB6Error) => {
    VB6Helpers.LastException = error;
    VB6Helpers.LastErrorNumber = error instanceof Error ? undefined : error.Number;
    VB6Helpers.LastErrorDescription = error instanceof Error ? error.message : error.Description;
  },
  Shell: (pathname: string) => {
    throw new Error('Run an executable program and returns a Variant (double) representing the program\'s task ID if successful; otherwise, it returns zero');
  },
  Sleep: (delay: number) => {
    const start = new Date().getTime();
    // tslint:disable-next-line: curly
    while (new Date().getTime() < start + delay);
  },
  Space: (count: number) => {
    let retval = '';
    if (count === null) {
      throw new InvalidUseOfNullError;
    } else {
      for (let i = 0; i < count; i++) {
        retval = `${retval} `;
      }
    }
    return retval;
  },
  Split: (expression: string, delimiter = " ", limit = -1, compare = CompareMethod.Binary) => {
    if (expression) {
      const splitted = `${expression}`.split(delimiter);
      if (limit != null && limit > -1) {
        const left = splitted.slice(limit - 1, splitted.length);
        splitted[limit - 1] = left.join(delimiter);
        return splitted.splice(0, limit);
      }
      return splitted;
    }
    return [];
  },
  Str: <T = any>(expression: T) => {
    if (typeof expression === 'string') {
      throw new TypeMismatchError;
    } else if (expression === null) {
      return null;
    } else if (expression === undefined) {
      return '0';
    } else {
      return expression.toString();
    }
  },
  // NOTES: compare not used
  StrComp: <T = any>(string1: T, string2: T, compare = CompareMethod.Binary) => {
    if (string1 == null || string2 == null) {
      return -1;
    } else {
      const { str1, str2 } = compare === CompareMethod.Text
        ? { str1: `${string1}`.toLowerCase(), str2: `${string2}`.toLowerCase() }
        : { str1: `${string1}`, str2: `${string2}` };
      return str1 === str2 ? 0 : (str1 > str2 ? 1 : -1);
    }
  },
  StrConv: <T = any>(value: T, conversion: VbStrConv, localeID?: number) => {
    if (typeof value === 'string') {
      switch (conversion) {
        case VbStrConv.FromUnicode:
          return String.fromCharCode(parseInt(value, 16));
        case VbStrConv.UpperCase:
          return value.toUpperCase();
        case VbStrConv.LowerCase:
          return value.toLowerCase();
        case VbStrConv.ProperCase:
          return value.replace(/\w\S*/g,
            function (txt) {
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
          );
        default:
          throw new NotSupportedError;
      }
    }
  },
  String: <T = any>(number: number, character: T) => {
    if (number == null) {
      throw new InvalidUseOfNullError;
    } else if (character === null) {
      return null;
    } else if (character === undefined) {
      return Array(++number).join(' ');
    } else {
      let char: string;
      if (typeof character === 'string') {
        char = character[0];
      } else if (typeof character === 'number') {
        char = String.fromCharCode(character % 256);
      } else {
        char = `${character}`[0];
      }
      return Array(++number).join(char);
    }
  },
  StringToByteArray: <T = any>(expression: T) => {
    const str = `${expression}`;
    const utf8: number[] = [];
    for (let i = 0; i < str.length; i++) {
      let charcode = str.charCodeAt(i);
      // tslint:disable-next-line: curly
      if (charcode < 0x80) utf8.push(charcode);
      else if (charcode < 0x800) {
        // tslint:disable-next-line: no-bitwise
        utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
      } else if (charcode < 0xd800 || charcode >= 0xe000) {
        // tslint:disable-next-line: no-bitwise
        utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
      } else {
        i++;
        // UTF-16 encodes 0x10000-0x10FFFF by
        // subtracting 0x10000 and splitting the
        // 20 bits of 0x0-0xFFFFF into two halves
        // tslint:disable-next-line: no-bitwise
        charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
        // tslint:disable-next-line: no-bitwise
        utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
      }
    }
    return utf8;
  },
  // NOTES: da implementare?
  ToOleColor: (...args: any) => {
    console.error('Not yet implemented');
  },
  Trim: <T = any>(expression: T) => {
    if (expression == null) {
      return '';
    } else {
      return expression.toString().trim();
    }
  },
  TypeName: <T = any>(expression: T) => {
    let retval: string = null;
    switch (typeof expression) {
      case 'number':
        if (Number.isInteger(expression)) {
          retval = 'Integer';
        } else if (isFinite(expression) && expression === Math.fround(expression)) {
          retval = 'Single';
        } else if (expression === expression && expression % 1 !== 0) {
          retval = 'Double';
        }
        break;
      case 'bigint':
        retval = 'Long';
        break;
      case 'string':
        if (!isNaN(new Date(expression).getTime())) {
          retval = 'Date';
        } else {
          retval = 'String';
        }
        break;
      case 'boolean':
        retval = 'Boolean';
        break;
      case 'undefined':
        retval = 'Empty';
        break;
      default:
        if (expression instanceof ArrayBuffer
          || expression instanceof Int8Array
          || expression instanceof Int16Array
          || expression instanceof Int32Array) {
          retval = 'Byte';
        } else if (expression instanceof Date) {
          retval = 'Date';
        } else if (expression === null) {
          retval = 'Null';
        } else {
          retval = 'Object'
        }
        break;
    }
    return retval;
  },
  // NOTES: need more clarifications
  UBound: <T = any>(arr: T, rank?: number) => {
    if (arr == null || !Array.isArray(arr)) {
      throw new InvalidProcedureCallOrArgumentError();
    }
    let temp = arr;
    while (rank > 1) {
      temp = temp[0];
      rank--;
    }
    if (Array.isArray(temp)) {
      return temp.length;
    } else {
      throw new IndexOutOfRangeError();
    }
  },
  UCase: <T = string>(string: T) => {
    if (string === undefined) {
      return '';
    } else if (string === null) {
      return null;
    } else {
      return `${string}`.toUpperCase();
    }
  },
  Unload: (component: IActionShellComponent, command?: string, ...params: any[]) => {
    if (command) {
      component.command(command, ...params);
    } else if (component.payload.stack.length > 1) {
      component.return();
    } else {
      component.router.navigate(['/']);
    }
  },
  Val: <T = any>(value: T) => {
    let retval: number;
    if (typeof value === 'boolean') {
      retval = value ? -1 : 0;
    } else if (value == null) {
      retval = 0;
    } else {
      retval = +value;
      if (isNaN(retval)) {
        if (typeof value === 'string') {
          let string = value.replace(/ /g, '');
          let radix = 10;

          if (string[0] === '&') {
            switch (string[1]) {
              case 'H': radix = 16;
                break;
              case 'O': radix = 8;
                break
            }
            string = string.slice(2);
          }

          retval = parseInt(string, radix);
        } else {
          retval = 0;
        }
      }
    }
    return isNaN(retval) ? 0 : retval;
  },
  Year: (value: Date) => {
    return value == null
      ? value as any
      : value.getFullYear();
  },
  ObjectError: -2147221504,
  LastException: null,
  LastErrorNumber: null,
  LastErrorDescription: null
};

// NOTE: functions to avoid edge cases not handled with setMonth
function addMonths(date: Date, amount: number) {
  const endDate = new Date(date.getTime());
  endDate.setMonth(endDate.getMonth() + amount);
  while (monthDiff(date, endDate) > amount) {
    endDate.setDate(endDate.getDate() - 1);
  }
  return new Date(endDate);
}

function monthDiff(from: Date, to: Date) {
  const years = to.getFullYear() - from.getFullYear();
  const months = to.getMonth() - from.getMonth();
  return 12 * years + months;
}
