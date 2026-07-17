import { FileSystemHelpers } from './file-system.helpers';
import moment from 'moment';
import numeral from 'numeral';
import { DateInterval, VbStrConv } from './enumerators';
import { IVB6Error } from './error';
import { FormatError, IndexOutOfRangeError, InvalidProcedureCallOrArgumentError, InvalidUseOfNullError, NotSupportedError, OverflowError, TypeMismatchError } from './error.types';
import { IActionShellComponent, VB6Helpers } from './helpers';
import { MsgBoxStyle } from './models';
import { Ref } from './ref';

describe('VB6Helpers Suite', () => {
  beforeAll(() => {
    moment.locale('it');

    numeral.register('locale', 'it', {
      delimiters: {
        thousands: '.',
        decimal: ','
      },
      abbreviations: {
        thousand: 'mila',
        million: 'mil',
        billion: 'b',
        trillion: 't'
      },
      ordinal: function (number) {
        return 'º';
      },
      currency: {
        symbol: '€'
      }
    });
  });
  test('should be defined', () => {
    const actual = VB6Helpers;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: ABS Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Abs;
    expect(actual).toBeDefined();
  });
  test('should 1 to be 1', () => {
    const value = 1;
    const actual = VB6Helpers.Abs(value);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  test('should 533 to be 533', () => {
    const value = 533;
    const actual = VB6Helpers.Abs(value);
    const expected = 533;
    expect(actual).toEqual(expected);
  });
  test('should 33.57 to be 33.57', () => {
    const value = 33.57;
    const actual = VB6Helpers.Abs(value);
    const expected = 33.57;
    expect(actual).toEqual(expected);
  });
  test('should -1 to be 1', () => {
    const value = -1;
    const actual = VB6Helpers.Abs(value);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  test('should -533 to be 533', () => {
    const value = -533;
    const actual = VB6Helpers.Abs(value);
    const expected = 533;
    expect(actual).toEqual(expected);
  });
  test('should -33.57 to be 33.57', () => {
    const value = -33.57;
    const actual = VB6Helpers.Abs(value);
    const expected = 33.57;
    expect(actual).toEqual(expected);
  });
  test('should 0 to be 0', () => {
    const value = 0;
    const actual = VB6Helpers.Abs(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should null to be 0', () => {
    const value = null;
    const actual = VB6Helpers.Abs(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should undefined to be 0', () => {
    const value = undefined;
    const actual = VB6Helpers.Abs(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should true to be 1', () => {
    const value = true;
    const actual = VB6Helpers.Abs(value);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  test('should false to be 0', () => {
    const value = false;
    const actual = VB6Helpers.Abs(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter is a "abcd"', () => {
    const value: any = 'abcd';
    const actual = VB6Helpers.Abs.bind(undefined, value);
    const expected = TypeMismatchError;
    expect(actual).toThrow(expected);
  });
});

describe.skip('VB6Helpers: ApplicationExit Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.ApplicationExit;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: Array Suite', () => {
  let array: number[];
  test('should be defined', () => {
    const actual = VB6Helpers.Array;
    expect(actual).toBeDefined();
  });
  test('should create array', () => {
    array = VB6Helpers.Array(2, 4, 6, 8, 10);
    const expected = [2, 4, 6, 8, 10];
    expect(array).toEqual(expected);
  });
  test('should first array item to be 2', () => {
    const actual = array[0];
    const expected = 2;
    expect(actual).toEqual(expected);
  });
  test('should second array item to be 4', () => {
    const actual = array[1];
    const expected = 4;
    expect(actual).toEqual(expected);
  });
  test('should third array item to be 6', () => {
    const actual = array[2];
    const expected = 6;
    expect(actual).toEqual(expected);
  });
  test.skip('should LBound array item to be 2', () => {
    const actual = array[VB6Helpers.LBound(array)];
    const expected = 2;
    expect(actual).toEqual(expected);
  });
  test.skip('should LBound array item to be 10', () => {
    const actual = array[VB6Helpers.UBound(array)];
    const expected = 10;
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: Asc Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Asc;
    expect(actual).toBeDefined();
  });
  test('should "A" to be 65', () => {
    const actual = VB6Helpers.Asc('A');
    const expected = 65;
    expect(actual).toEqual(expected);
  });
  test('should "a" to be 97', () => {
    const actual = VB6Helpers.Asc('a');
    const expected = 97;
    expect(actual).toEqual(expected);
  });
  test('should "Asp" to be 65', () => {
    const actual = VB6Helpers.Asc('Asp');
    const expected = 65;
    expect(actual).toEqual(expected);
  });
  test('should "Z" to be 90', () => {
    const actual = VB6Helpers.Asc('Z');
    const expected = 90;
    expect(actual).toEqual(expected);
  });
  test('should "z" to be 122', () => {
    const actual = VB6Helpers.Asc('z');
    const expected = 122;
    expect(actual).toEqual(expected);
  });
  test('should "P" to be 80', () => {
    const actual = VB6Helpers.Asc('P');
    const expected = 80;
    expect(actual).toEqual(expected);
  });
  test('should "2" to be 50', () => {
    const actual = VB6Helpers.Asc('2');
    const expected = 50;
    expect(actual).toEqual(expected);
  });
  test('should "," to be 44', () => {
    const actual = VB6Helpers.Asc(',');
    const expected = 44;
    expect(actual).toEqual(expected);
  });
  test('should " " to be 32', () => {
    const actual = VB6Helpers.Asc(' ');
    const expected = 32;
    expect(actual).toEqual(expected);
  });
  test('should true to be 84', () => {
    const actual = VB6Helpers.Asc('true');
    const expected = 84;
    expect(actual).toEqual(expected);
  });
  test('should false to be 70', () => {
    const actual = VB6Helpers.Asc('false');
    const expected = 70;
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter is an empty string', () => {
    const actual = VB6Helpers.Asc.bind(undefined, '');
    const expected = InvalidProcedureCallOrArgumentError;
    expect(actual).toThrow(expected);
  });
  test('should throw error when parameter is null', () => {
    const actual = VB6Helpers.Asc.bind(undefined, null);
    const expected = InvalidUseOfNullError;
    expect(actual).toThrow(expected);
  });
});

describe('VB6Helpers: Beep Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Beep;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: CBool Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.CBool;
    expect(actual).toBeDefined();
  });
  test('should 1 to be true', () => {
    const value = 1;
    const actual = VB6Helpers.CBool(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should 33.57 to be true', () => {
    const value = 33.57;
    const actual = VB6Helpers.CBool(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should -1 to be true', () => {
    const value = -1;
    const actual = VB6Helpers.CBool(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should 0 to be false', () => {
    const value = 0;
    const actual = VB6Helpers.CBool(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should null to be false', () => {
    const value = null;
    const actual = VB6Helpers.CBool(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should undefined to be false', () => {
    const value = undefined;
    const actual = VB6Helpers.CBool(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should true to be true', () => {
    const value = true;
    const actual = VB6Helpers.CBool(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should false to be false', () => {
    const value = false;
    const actual = VB6Helpers.CBool(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should "a" == "a" to be true', () => {
    const value = 'a' == 'a';
    const actual = VB6Helpers.CBool(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should "a" == "A" to be false', () => {
    const value = 'a' == 'A' as any;
    const actual = VB6Helpers.CBool(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter is a "abcd"', () => {
    const value: any = 'abcd';
    const actual = VB6Helpers.CBool.bind(undefined, value);
    const expected = FormatError;
    expect(actual).toThrow(expected);
  });
});

describe.skip('VB6Helpers: CByte Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.CByte;
    expect(actual).toBeDefined();
  });
  test('should 1 to be 1', () => {
    const value = 1;
    const actual = VB6Helpers.CByte(value);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  test('should 1.5 to be 2', () => {
    const value = 1.5;
    const actual = VB6Helpers.CByte(value);
    const expected = 2;
    expect(actual).toEqual(expected);
  });
  test('should 2.5 to be 2', () => {
    const value = 2.5;
    const actual = VB6Helpers.CByte(value);
    const expected = 2;
    expect(actual).toEqual(expected);
  });
  test('should 0 to be 0', () => {
    const value = 0;
    const actual = VB6Helpers.CByte(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter is -1', () => {
    const value = -1;
    const actual = VB6Helpers.CByte.bind(undefined, value);
    const expected = OverflowError;
    expect(actual).toThrow(expected);
  });
  test('should 123.5678 to be 124', () => {
    const value = 123.5678;
    const actual = VB6Helpers.CByte(value);
    const expected = 124;
    expect(actual).toEqual(expected);
  });
  test('should 123.4567 to be 123', () => {
    const value = 123.4567;
    const actual = VB6Helpers.CByte(value);
    const expected = 123;
    expect(actual).toEqual(expected);
  });
  test('should "123.4567" to be 123', () => {
    const value = '123.4567';
    const actual = VB6Helpers.CByte(value);
    const expected = 123;
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter is 256', () => {
    const value = 256;
    const actual = VB6Helpers.CByte.bind(undefined, value);
    const expected = OverflowError;
    expect(actual).toThrow(expected);
  });
  test('should null to be null', () => {
    const value = null;
    const actual = VB6Helpers.CByte(value);
    const expected = null;
    expect(actual).toEqual(expected);
  });
  test('should undefined to be 0', () => {
    const value = undefined;
    const actual = VB6Helpers.CByte(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should true to be 255', () => {
    const value = true;
    const actual = VB6Helpers.CByte(value);
    const expected = 255;
    expect(actual).toEqual(expected);
  });
  test('should false to be 0', () => {
    const value = false;
    const actual = VB6Helpers.CByte(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter is a "abcd"', () => {
    const value: any = 'abcd';
    const actual = VB6Helpers.CByte.bind(undefined, value);
    const expected = TypeMismatchError;
    expect(actual).toThrow(expected);
  });
});

describe('VB6Helpers: CDate Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.CDate;
    expect(actual).toBeDefined();
  });
  test('should "May 14 1977" to be recognized', () => {
    const value = 'May 14 1977';
    const actual = VB6Helpers.CDate(value);
    const expected = new Date(1977, 4, 14);
    expect(actual).toEqual(expected);
  });
  test('should "14/May/1977" to be recognized', () => {
    const value = '14/May/1977';
    const actual = VB6Helpers.CDate(value);
    const expected = new Date(1977, 4, 14);
    expect(actual).toEqual(expected);
  });
  test('should "14/05/1977" to be recognized', () => {
    const value = '14/05/1977';
    const actual = VB6Helpers.CDate(value);
    const expected = new Date(1977, 4, 14);
    expect(actual).toEqual(expected);
  });
  test('should "14-05-1977" to be recognized', () => {
    const value = '14-05-1977';
    const actual = VB6Helpers.CDate(value);
    const expected = new Date(1977, 4, 14);
    expect(actual).toEqual(expected);
  });
  test('should "05/14/1977" to be recognized', () => {
    const value = '05/14/1977';
    const actual = VB6Helpers.CDate(value);
    const expected = new Date(1977, 4, 14);
    expect(actual).toEqual(expected);
  });
  test('should "05-14-1977" to be recognized', () => {
    const value = '05-14-1977';
    const actual = VB6Helpers.CDate(value);
    const expected = new Date(1977, 4, 14);
    expect(actual).toEqual(expected);
  });
  test('should 0 to be equal to midnight', () => {
    const value = 0;
    const actual = VB6Helpers.CDate(value);
    const expectedHours = 12;
    const expectedMinutes = 0;
    const expectedSeconds = 0;
    expect(actual.getHours()).toEqual(expectedHours);
    expect(actual.getMinutes()).toEqual(expectedMinutes);
    expect(actual.getSeconds()).toEqual(expectedSeconds);
  });
  test('should undefined to be equal to midnight', () => {
    const value = undefined;
    const actual = VB6Helpers.CDate(value);
    const expectedHours = 12;
    const expectedMinutes = 0;
    const expectedSeconds = 0;
    expect(actual.getHours()).toEqual(expectedHours);
    expect(actual.getMinutes()).toEqual(expectedMinutes);
    expect(actual.getSeconds()).toEqual(expectedSeconds);
  });
  test('should false to be equal to midnight', () => {
    const value = false;
    const actual = VB6Helpers.CDate(value);
    const expectedHours = 12;
    const expectedMinutes = 0;
    const expectedSeconds = 0;
    expect(actual.getHours()).toEqual(expectedHours);
    expect(actual.getMinutes()).toEqual(expectedMinutes);
    expect(actual.getSeconds()).toEqual(expectedSeconds);
  });
  test('should -1 to be equal to minimum date', () => {
    const value = -1;
    const actual = VB6Helpers.CDate(value);
    const expectedYears = 1899;
    const expectedMonth = 11;
    const expectedDay = 29;
    expect(actual.getFullYear()).toEqual(expectedYears);
    expect(actual.getMonth()).toEqual(expectedMonth);
    expect(actual.getDate()).toEqual(expectedDay);
  });
  test('should true to be equal to midnight', () => {
    const value = true;
    const actual = VB6Helpers.CDate(value);
    const expectedYears = 1899;
    const expectedMonth = 11;
    const expectedDay = 29;
    expect(actual.getFullYear()).toEqual(expectedYears);
    expect(actual.getMonth()).toEqual(expectedMonth);
    expect(actual.getDate()).toEqual(expectedDay);
  });
  test('should throw error when parameter is a "abcd"', () => {
    const value: any = 'abcd';
    const actual = VB6Helpers.CDate.bind(undefined, value);
    const expected = TypeMismatchError;
    expect(actual).toThrow(expected);
  });
  test('should "01/02/2020" to be converted correctly', () => {
    const value = '01/02/2020';
    const actual = VB6Helpers.CDate(value);
    const expected = new Date(2020, 1, 1);
    expect(actual).toEqual(expected);
  });
  test('should "2020/02/01" to be converted correctly', () => {
    const value = '2020/02/01';
    const actual = VB6Helpers.CDate(value);
    const expected = new Date(2020, 1, 1);
    expect(actual).toEqual(expected);
  });
  test('should "2020/02/23" to be converted correctly', () => {
    const value = '2020/02/23';
    const actual = VB6Helpers.CDate(value);
    const expected = new Date(2020, 1, 23);
    expect(actual).toEqual(expected);
  });
  test('should "2020-02-23" to be converted correctly', () => {
    const value = '2020-02-23';
    const actual = VB6Helpers.CDate(value);
    const expected = new Date(2020, 1, 23);
    expect(actual).toEqual(expected);
  });
  test('should "02/23/2020" (MDY format) to be converted correctly', () => {
    const value = '02/23/2020';
    const actual = VB6Helpers.CDate(value);
    const expected = new Date(2020, 1, 23);
    expect(actual).toEqual(expected);
  });
  test('should "02-23-2020" (MDY format) to be converted correctly', () => {
    const value = '02-23-2020';
    const actual = VB6Helpers.CDate(value);
    const expected = new Date(2020, 1, 23);
    expect(actual).toEqual(expected);
  });
  test('should "2020/02/23 15:14:21" to be converted correctly', () => {
    const value = '2020/02/23 15:14:21';
    const actual = VB6Helpers.CDate(value);
    const expected = new Date(2020, 1, 23, 15, 14, 21);
    expect(actual).toEqual(expected);
  });
  test('should "23/02/2020 15:14:21" to be converted correctly', () => {
    const value = '23/02/2020 15:14:21';
    const actual = VB6Helpers.CDate(value);
    const expected = new Date(2020, 1, 23, 15, 14, 21);
    expect(actual).toEqual(expected);
  });
  test('should "23-02-2020 15:14:21" to be converted correctly', () => {
    const value = '23-02-2020 15:14:21';
    const actual = VB6Helpers.CDate(value);
    const expected = new Date(2020, 1, 23, 15, 14, 21);
    expect(actual).toEqual(expected);
  });
  test('should "23-Feb-2020 15:14:21" to be converted correctly', () => {
    const value = '23-Feb-2020 15:14:21';
    const actual = VB6Helpers.CDate(value);
    const expected = new Date(2020, 1, 23, 15, 14, 21);
    expect(actual).toEqual(expected);
  });
  test('should "23/Feb/2020 15:14:21" to be converted correctly', () => {
    const value = '23/Feb/2020 15:14:21';
    const actual = VB6Helpers.CDate(value);
    const expected = new Date(2020, 1, 23, 15, 14, 21);
    expect(actual).toEqual(expected);
  });
  test('should "02/23/2020 15:14:21" (MDY format) to be converted correctly', () => {
    const value = '02/23/2020 15:14:21';
    const actual = VB6Helpers.CDate(value);
    const expected = new Date(2020, 1, 23, 15, 14, 21);
    expect(actual).toEqual(expected);
  });
  test('should "02-23-2020 15:14:21" to be converted correctly', () => {
    const value = '02-23-2020 15:14:21';
    const actual = VB6Helpers.CDate(value);
    const expected = new Date(2020, 1, 23, 15, 14, 21);
    expect(actual).toEqual(expected);
  });
  test('should "Feb-23-2020 15:14:21" (MDY format) to be converted correctly', () => {
    const value = 'Feb-23-2020 15:14:21';
    const actual = VB6Helpers.CDate(value);
    const expected = new Date(2020, 1, 23, 15, 14, 21);
    expect(actual).toEqual(expected);
  });
  test('should "Feb/23/2020 15:14:21" (MDY format) to be converted correctly', () => {
    const value = 'Feb/23/2020 15:14:21';
    const actual = VB6Helpers.CDate(value);
    const expected = new Date(2020, 1, 23, 15, 14, 21);
    expect(actual).toEqual(expected);
  });
  test.skip('should "23/02/2020 03:14:21 PM" to be converted correctly', () => {
    const value = '23/02/2020 03:14:21 PM';
    const actual = VB6Helpers.CDate(value);
    const expected = new Date(2020, 1, 23, 15, 14, 21);
    expect(actual).toEqual(expected);
  });
  test('should "23/02/2020 03:14:21 AM" to be converted correctly', () => {
    const value = '23/02/2020 03:14:21 AM';
    const actual = VB6Helpers.CDate(value);
    const expected = new Date(2020, 1, 23, 3, 14, 21);
    expect(actual).toEqual(expected);
  });
  test('should "02/23/2020 03:14:21 AM" to be converted correctly', () => {
    const value = '02/23/2020 03:14:21 AM';
    const actual = VB6Helpers.CDate(value);
    const expected = new Date(2020, 1, 23, 3, 14, 21);
    expect(actual).toEqual(expected);
  });
  test('should "02/23/2020 03:14:21 PM" to be converted correctly', () => {
    const value = '02/23/2020 03:14:21 PM';
    const actual = VB6Helpers.CDate(value);
    const expected = new Date(2020, 1, 23, 15, 14, 21);
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: CDbl Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.CDbl;
    expect(actual).toBeDefined();
  });
  test('should 1 to be 1', () => {
    const value = 1;
    const actual = VB6Helpers.CDbl(value);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  test('should 2.5 / 3 to be 	0.833333333333333', () => {
    const value = 2.5 / 3;
    const actual = Math.round(VB6Helpers.CDbl(value));
    const expected = Math.round(0.833333333333333);
    expect(actual).toEqual(expected);
  });
  test('should the italian string "0,83" to be 	0.83', () => {
    const value = "0,83";
    const defaultLocale = numeral.locale();
    numeral.locale('it');
    const actual = VB6Helpers.CDbl(value);
    const expected = 0.83;
    numeral.locale(defaultLocale);
    expect(actual).toEqual(expected);
  });
  test('should 0 to be 0', () => {
    const value = 0;
    const actual = VB6Helpers.CDbl(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should -1 to be -1', () => {
    const value = -1;
    const actual = VB6Helpers.CDbl(value);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter is null', () => {
    const value = null;
    const actual = VB6Helpers.CDbl.bind(undefined, value);
    const expected = TypeMismatchError;
    expect(actual).toThrow(expected);
  });
  test('should throw error when parameter is "abcd"', () => {
    const value = 'abcd';
    const actual = VB6Helpers.CDbl.bind(undefined, value);
    const expected = TypeMismatchError;
    expect(actual).toThrow(expected);
  });
  test('should throw error when parameter is undefined', () => {
    const value = undefined;
    const actual = VB6Helpers.CDbl.bind(undefined, value);
    const expected = TypeMismatchError;
    expect(actual).toThrow(expected);
  });
  test('should true to be -1', () => {
    const value = true;
    const actual = VB6Helpers.CDbl(value);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  test('should false to be 0', () => {
    const value = false;
    const actual = VB6Helpers.CDbl(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: CDec Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.CDec;
    expect(actual).toBeDefined();
  });
  test('should 1 to be 1', () => {
    const value = 1;
    const actual = VB6Helpers.CDec(value);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  test('should 2.5 / 3 to be 	0.833333333333333', () => {
    const value = 2.5 / 3;
    const actual = Math.round(VB6Helpers.CDec(value));
    const expected = Math.round(0.833333333333333);
    expect(actual).toEqual(expected);
  });
  test('should 0 to be 0', () => {
    const value = 0;
    const actual = VB6Helpers.CDec(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should -1 to be -1', () => {
    const value = -1;
    const actual = VB6Helpers.CDec(value);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  test('should null to be 0', () => {
    const value = null;
    const actual = VB6Helpers.CDec(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter is "abcd"', () => {
    const value = 'abcd';
    const actual = VB6Helpers.CDec.bind(undefined, value);
    const expected = TypeMismatchError;
    expect(actual).toThrow(expected);
  });
  test('should undefined to be 0', () => {
    const value = undefined;
    const actual = VB6Helpers.CDec(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should true to be -1', () => {
    const value = true;
    const actual = VB6Helpers.CDec(value);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  test('should false to be 0', () => {
    const value = false;
    const actual = VB6Helpers.CDec(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: Choose Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Choose;
    expect(actual).toBeDefined();
  });
  test('should first item to be "One"', () => {
    const actual = VB6Helpers.Choose(0, 'One', 'Two', 'Three');
    const expected = 'One';
    expect(actual).toEqual(expected);
  });
  test('should second item to be "Two"', () => {
    const actual = VB6Helpers.Choose(1, 'One', 'Two', 'Three');
    const expected = 'Two';
    expect(actual).toEqual(expected);
  });
  test('should third item to be "Three"', () => {
    const actual = VB6Helpers.Choose(2, 'One', 'Two', 'Three');
    const expected = 'Three';
    expect(actual).toEqual(expected);
  });
  test('should throw error when index is 3', () => {
    const actual = VB6Helpers.Choose.bind(undefined, 3, 'One', 'Two', 'Three');
    const expected = IndexOutOfRangeError;
    expect(actual).toThrow(expected);
  });
  test('should throw error when index is -1', () => {
    const actual = VB6Helpers.Choose.bind(undefined, -1, 'One', 'Two', 'Three');
    const expected = IndexOutOfRangeError;
    expect(actual).toThrow(expected);
  });
  test('should 1.3 item to be "Two"', () => {
    const actual = VB6Helpers.Choose(1.3, 'One', 'Two', 'Three');
    const expected = 'Two';
    expect(actual).toEqual(expected);
  });
  test('should 1.99 item to be "Three"', () => {
    const actual = VB6Helpers.Choose(1.99, 'One', 'Two', 'Three');
    const expected = 'Three';
    expect(actual).toEqual(expected);
  });
  test('should throw error when index is a "abcd"', () => {
    const value: any = 'abcd';
    const actual = VB6Helpers.Choose.bind(undefined, value);
    const expected = FormatError;
    expect(actual).toThrow(expected);
  });
  test('should "1" item to be "Two"', () => {
    const value: any = '1';
    const actual = VB6Helpers.Choose(value, 'One', 'Two', 'Three');
    const expected = 'Two';
    expect(actual).toEqual(expected);
  });
  test('should undefined index to be null', () => {
    const actual = VB6Helpers.Choose(undefined, 'One', 'Two', 'Three');
    const expected = 'One';
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: Chr Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Chr;
    expect(actual).toBeDefined();
  });
  test('should 65 to be "A"', () => {
    const actual = VB6Helpers.Chr(65);
    const expected = 'A';
    expect(actual).toEqual(expected);
  });
  test('should 97 to be "a"', () => {
    const actual = VB6Helpers.Chr(97);
    const expected = 'a';
    expect(actual).toEqual(expected);
  });
  test('should 90 to be "Z"', () => {
    const actual = VB6Helpers.Chr(90);
    const expected = 'Z';
    expect(actual).toEqual(expected);
  });
  test('should 122 to be "z"', () => {
    const actual = VB6Helpers.Chr(122);
    const expected = 'z';
    expect(actual).toEqual(expected);
  });
  test('should 80 to be "P"', () => {
    const actual = VB6Helpers.Chr(80);
    const expected = 'P';
    expect(actual).toEqual(expected);
  });
  test('should 80.5 to be "Q"', () => {
    const actual = VB6Helpers.Chr(80.5);
    const expected = 'Q';
    expect(actual).toEqual(expected);
  });
  test('should 80.9 to be "Q"', () => {
    const actual = VB6Helpers.Chr(80.9);
    const expected = 'Q';
    expect(actual).toEqual(expected);
  });
  test('should 50 to be "2"', () => {
    const actual = VB6Helpers.Chr(50);
    const expected = '2';
    expect(actual).toEqual(expected);
  });
  test('should 47 to be /', () => {
    const actual = VB6Helpers.Chr(47);
    const expected = '/';
    expect(actual).toEqual(expected);
  });
  test('should 44 to be ,', () => {
    const actual = VB6Helpers.Chr(44);
    const expected = ',';
    expect(actual).toEqual(expected);
  });
  test('should 32 to be " "', () => {
    const actual = VB6Helpers.Chr(32);
    const expected = ' ';
    expect(actual).toEqual(expected);
  });
  test('should 0 to be ""', () => {
    const actual = VB6Helpers.Chr(0);
    const expected = '';
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter is 256', () => {
    const value = 256;
    const actual = VB6Helpers.Chr.bind(undefined, value);
    const expected = InvalidProcedureCallOrArgumentError;
    expect(actual).toThrow(expected);
  });
  test('should throw error when parameter is null', () => {
    const value = null;
    const actual = VB6Helpers.Chr.bind(undefined, value);
    const expected = InvalidUseOfNullError;
    expect(actual).toThrow(expected);
  });
  test('should throw error when parameter is true', () => {
    const value = true;
    const actual = VB6Helpers.Chr.bind(undefined, value);
    const expected = InvalidProcedureCallOrArgumentError;
    expect(actual).toThrow(expected);
  });
  test('should false to be ""', () => {
    const actual = VB6Helpers.Chr(false as any);
    const expected = '';
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: CInt Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.CInt;
    expect(actual).toBeDefined();
  });
  test('should 1 to be 1', () => {
    const value = 1;
    const actual = VB6Helpers.CInt(value);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  test('should 1.5 to be 2', () => {
    const value = 1.5;
    const actual = Math.round(VB6Helpers.CInt(value));
    const expected = Math.round(2);
    expect(actual).toEqual(expected);
  });
  test('should 2.5 to be 3', () => {
    const value = 2.5;
    const actual = Math.round(VB6Helpers.CInt(value));
    const expected = Math.round(3);
    expect(actual).toEqual(expected);
  });
  test('should 0 to be 0', () => {
    const value = 0;
    const actual = VB6Helpers.CInt(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should -1 to be -1', () => {
    const value = -1;
    const actual = VB6Helpers.CInt(value);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  test('should 123.5678 to be 124', () => {
    const value = 123.5678;
    const actual = VB6Helpers.CInt(value);
    const expected = 124;
    expect(actual).toEqual(expected);
  });
  test('should 123.4567 to be 123', () => {
    const value = 123.4567;
    const actual = VB6Helpers.CInt(value);
    const expected = 123;
    expect(actual).toEqual(expected);
  });
  test('should "123.4567" to be 123', () => {
    const value = '123.4567';
    const actual = VB6Helpers.CInt(value);
    const expected = 123;
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter is -2147483649', () => {
    const value = -2147483649;
    const actual = VB6Helpers.CInt.bind(undefined, value);
    const expected = OverflowError;
    expect(actual).toThrow(expected);
  });
  test('should throw error when parameter is 2147483648', () => {
    const value = 2147483648;
    const actual = VB6Helpers.CInt.bind(undefined, value);
    const expected = OverflowError;
    expect(actual).toThrow(expected);
  });
  test('should null to be 0', () => {
    const value = null;
    const actual = VB6Helpers.CInt(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter is "abcd"', () => {
    const value = 'abcd';
    const actual = VB6Helpers.CInt.bind(undefined, value);
    const expected = TypeMismatchError;
    expect(actual).toThrow(expected);
  });
  test('should undefined to be 0', () => {
    const value = undefined;
    const actual = VB6Helpers.CInt(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should true to be -1', () => {
    const value = true;
    const actual = VB6Helpers.CInt(value);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  test('should false to be 0', () => {
    const value = false;
    const actual = VB6Helpers.CInt(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: ClearError Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.ClearError;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: Clipboard Suite', () => {
  beforeAll(() => {
    let data: string;
    Object.assign(navigator, {
      clipboard: {
        writeText: text => {
          data = text;
        },
        readText: () => new Promise((resolve, reject) => {
          resolve(data);
        })
      },
    });
    jest.spyOn(navigator.clipboard, "writeText");
    jest.spyOn(navigator.clipboard, "readText");
  });
  test('should be defined', () => {
    const actual = VB6Helpers.Clipboard;
    expect(actual).toBeDefined();
  });
  test('should Clear method be defined', () => {
    const actual = VB6Helpers.Clipboard.Clear;
    expect(actual).toBeDefined();
  });
  test('should SetText method be defined', () => {
    const actual = VB6Helpers.Clipboard.SetText;
    expect(actual).toBeDefined();
  });
  test('should GetText method be defined', () => {
    const actual = VB6Helpers.Clipboard.GetText;
    expect(actual).toBeDefined();
  });
  test('should "Hello world" copied to clipboard', () => {
    const value = 'Hello world';
    VB6Helpers.Clipboard.SetText(value);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(value);
  });
  test('should clipboard has "Hello world" copied', () => {
    const value = 'Hello world';
    expect(VB6Helpers.Clipboard.GetText()).resolves.toEqual(value);
    expect(navigator.clipboard.readText).toHaveBeenCalled();
  });
  test.skip('should clear clipboard', () => {
    VB6Helpers.Clipboard.Clear();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(' ');
  });
});

describe('VB6Helpers: CloneArray Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.CloneArray;
    expect(actual).toBeDefined();
  });
  test('should clone an array', () => {
    const value = [1, 2, 3];
    const actual = VB6Helpers.CloneArray(value);
    expect(actual).toEqual([1, 2, 3]);
    value[0] = 5;
    expect(actual).toEqual([1, 2, 3]);
    actual[1] = 11;
    expect(value).toEqual([5, 2, 3]);
  });
  test('should clone deep an array', () => {
    const value = [{ name: 'Mario' }, { name: 'Francesco' }];
    const actual = VB6Helpers.CloneArray(value, true);
    expect(actual).toEqual([{ name: 'Mario' }, { name: 'Francesco' }]);
    value[0].name = 'Lorenzo';
    expect(actual).toEqual([{ name: 'Mario' }, { name: 'Francesco' }]);
    actual[1].name = 'Giacomo';
    expect(value).toEqual([{ name: 'Lorenzo' }, { name: 'Francesco' }]);
  });
});

describe('VB6Helpers: CreateObject and RegisterObject Suite', () => {
  test('should be CreateObject defined', () => {
    const actual = VB6Helpers.CreateObject;
    expect(actual).toBeDefined();
  });
  test('should be RegisterObject defined', () => {
    const actual = VB6Helpers.RegisterObject;
    expect(actual).toBeDefined();
  });
  test('should register and create an object', () => {
    let expected: FileSystemHelpers;
    VB6Helpers.RegisterObject('Scripting.FileSystemHelpers', () => {
      expected = new FileSystemHelpers();
      return expected;
    });
    const actual = VB6Helpers.CreateObject<FileSystemHelpers>('Scripting.FileSystemHelpers');
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: CShort Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.CShort;
    expect(actual).toBeDefined();
  });
  test('should 1 to be 1', () => {
    const value = 1;
    const actual = VB6Helpers.CShort(value);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  test('should 1.5 to be 2', () => {
    const value = 1.5;
    const actual = Math.round(VB6Helpers.CShort(value));
    const expected = Math.round(2);
    expect(actual).toEqual(expected);
  });
  test('should 2.5 to be 3', () => {
    const value = 2.5;
    const actual = Math.round(VB6Helpers.CShort(value));
    const expected = Math.round(3);
    expect(actual).toEqual(expected);
  });
  test('should 0 to be 0', () => {
    const value = 0;
    const actual = VB6Helpers.CShort(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should -1 to be -1', () => {
    const value = -1;
    const actual = VB6Helpers.CShort(value);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  test('should 123.5678 to be 124', () => {
    const value = 123.5678;
    const actual = VB6Helpers.CShort(value);
    const expected = 124;
    expect(actual).toEqual(expected);
  });
  test('should 123.4567 to be 123', () => {
    const value = 123.4567;
    const actual = VB6Helpers.CShort(value);
    const expected = 123;
    expect(actual).toEqual(expected);
  });
  test('should "123.4567" to be 123', () => {
    const value = '123.4567';
    const actual = VB6Helpers.CShort(value);
    const expected = 123;
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter is -32769', () => {
    const value = -32769;
    const actual = VB6Helpers.CShort.bind(undefined, value);
    const expected = OverflowError;
    expect(actual).toThrow(expected);
  });
  test('should throw error when parameter is 32768', () => {
    const value = 32768;
    const actual = VB6Helpers.CShort.bind(undefined, value);
    const expected = OverflowError;
    expect(actual).toThrow(expected);
  });
  test('should null to be 0', () => {
    const value = null;
    const actual = VB6Helpers.CShort(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter is "abcd"', () => {
    const value = 'abcd';
    const actual = VB6Helpers.CShort.bind(undefined, value);
    const expected = TypeMismatchError;
    expect(actual).toThrow(expected);
  });
  test('should undefined to be 0', () => {
    const value = undefined;
    const actual = VB6Helpers.CShort(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should true to be -1', () => {
    const value = true;
    const actual = VB6Helpers.CShort(value);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  test('should false to be 0', () => {
    const value = false;
    const actual = VB6Helpers.CShort(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: CSng Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.CSng;
    expect(actual).toBeDefined();
  });
  test('should 1 to be 1', () => {
    const value = 1;
    const actual = VB6Helpers.CSng(value);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  test('should 2.5 / 3 to be 	0.833333333333333', () => {
    const value = 2.5 / 3;
    const actual = Math.round(VB6Helpers.CSng(value));
    const expected = Math.round(0.833333333333333);
    expect(actual).toEqual(expected);
  });
  test('should 0 to be 0', () => {
    const value = 0;
    const actual = VB6Helpers.CSng(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should -1 to be -1', () => {
    const value = -1;
    const actual = VB6Helpers.CSng(value);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  test('should null to be 0', () => {
    const value = null;
    const actual = VB6Helpers.CSng(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter is "abcd"', () => {
    const value = 'abcd';
    const actual = VB6Helpers.CSng.bind(undefined, value);
    const expected = TypeMismatchError;
    expect(actual).toThrow(expected);
  });
  test('should undefined to be 0', () => {
    const value = undefined;
    const actual = VB6Helpers.CSng(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should true to be -1', () => {
    const value = true;
    const actual = VB6Helpers.CSng(value);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  test('should false to be 0', () => {
    const value = false;
    const actual = VB6Helpers.CSng(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: CStr Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.CStr;
    expect(actual).toBeDefined();
  });
  test('should 1 to be "1"', () => {
    const value = 1;
    const actual = VB6Helpers.CStr(value);
    const expected = '1';
    expect(actual).toEqual(expected);
  });
  test('should 1.5 to be "1.5"', () => {
    const value = 1.5;
    const actual = VB6Helpers.CStr(value);
    const expected = '1.5';
    expect(actual).toEqual(expected);
  });
  test('should 1.5 to be "1,5" in italian systems', () => {
    const value = 1.5;
    const defaultLocale = numeral.locale();
    numeral.locale('it');
    const actual = VB6Helpers.CStr(value);
    numeral.locale(defaultLocale);
    const expected = '1,5';
    expect(actual).toEqual(expected);
  });

  test('should 1500000.12 to be "1500000,12" in italian systems', () => {
    const value = 1500000.12;
    const defaultLocale = numeral.locale();
    numeral.locale('it');
    const actual = VB6Helpers.CStr(value);
    numeral.locale(defaultLocale);
    const expected = '1500000,12';
    expect(actual).toEqual(expected);
  });
  test('should 0 to be "0"', () => {
    const value = 0;
    const actual = VB6Helpers.CStr(value);
    const expected = '0';
    expect(actual).toEqual(expected);
  });
  test('should -1 to be "-1"', () => {
    const value = -1;
    const actual = VB6Helpers.CStr(value);
    const expected = '-1';
    expect(actual).toEqual(expected);
  });
  test('should 5>10 to be "false"', () => {
    const value = 5 > 10;
    const actual = VB6Helpers.CStr(value);
    const expected = 'false';
    expect(actual).toEqual(expected);
  });
  test('should 5<10 to be "true"', () => {
    const value = 5 < 10;
    const actual = VB6Helpers.CStr(value);
    const expected = 'true';
    expect(actual).toEqual(expected);
  });
  test('should null to be null', () => {
    const value = null;
    const actual = VB6Helpers.CStr(value);
    const expected = null;
    expect(actual).toEqual(expected);
  });
  test('should undefined to be null', () => {
    const value = undefined;
    const actual = VB6Helpers.CStr(value);
    const expected = null;
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: DateAdd Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.DateAdd;
    expect(actual).toBeDefined();
  });
  test('should throw error when parameter is "test data"', () => {
    const interval = DateInterval.Second;
    const number = 10;
    const actual = VB6Helpers.DateAdd.bind(undefined, interval, number, 'test data');
    const expected = FormatError;
    expect(actual).toThrow(expected);
  });
  test('should "14/09/2020 00:00:00 + 10 seconds" to be "14/09/2020 00:00:10"', () => {
    const interval = DateInterval.Second;
    const number = 10;
    const date = new Date(2020, 8, 14, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2020, 8, 14, 0, 0, 10);
    expect(actual).toEqual(expected);
  });
  test('should "15/09/2020 + 100 seconds (with s)" to be "15/09/2020 00:01:40"', () => {
    const interval = 's';
    const number = 100;
    const date = new Date(2020, 8, 15, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2020, 8, 15, 0, 1, 40);
    expect(actual).toEqual(expected);
  });
  test('should "15/09/2020 + 100 seconds (with S)" to be "15/09/2020 00:01:40"', () => {
    const interval = 'S';
    const number = 100;
    const date = new Date(2020, 8, 15, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2020, 8, 15, 0, 1, 40);
    expect(actual).toEqual(expected);
  });
  test('should "14/09/2020 00:00:00 + 10 minutes" to be "14/09/2020 00:10:00"', () => {
    const interval = DateInterval.Minute;
    const number = 10;
    const date = new Date(2020, 8, 14, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2020, 8, 14, 0, 10, 0);
    expect(actual).toEqual(expected);
  });
  test('should "15/09/2020 + 100 minutes (with n)" to be "15/09/2020 01:40:00"', () => {
    const interval = 'n';
    const number = 100;
    const date = new Date(2021, 8, 15, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2021, 8, 15, 1, 40, 0);
    expect(actual).toEqual(expected);
  });
  test('should "15/09/2020 + 100 minutes (with N)" to be "15/09/2020 01:40:00"', () => {
    const interval = 'N';
    const number = 100;
    const date = new Date(2020, 8, 15, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2020, 8, 15, 1, 40, 0);
    expect(actual).toEqual(expected);
  });
  test('should "14/09/2020 00:00:00 + 2.5 hours" to be "14/09/2020 02:00:00"', () => {
    const interval = DateInterval.Hour;
    const number = 2.5;
    const date = new Date(2020, 8, 14, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2020, 8, 14, 2, 0, 0);
    expect(actual).toEqual(expected);
  });
  test('should "15/09/2020 + 100 hours (with h)" to be "19/09/2020 04:00:00"', () => {
    const interval = 'h';
    const number = 100;
    const date = new Date(2020, 8, 15, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2020, 8, 19, 4, 0, 0);
    expect(actual).toEqual(expected);
  });
  test('should "15/09/2020 + 1000 hours (with H)" to be "26/10/2020 16:00:00"', () => {
    const interval = 'H';
    const number = 1000;
    const date = new Date(2020, 8, 15, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2020, 9, 26, 16, 0, 0);
    expect(actual).toEqual(expected);
  });
  test('should "14/09/2020 00:00:00 + 7 days" to be "21/09/2020 00:00:00"', () => {
    const interval = DateInterval.Day;
    const number = 7;
    const date = new Date(2020, 8, 14, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2020, 8, 21, 0, 0, 0);
    expect(actual).toEqual(expected);
  });
  test('should "15/09/2020 + 120 days (with d)" to be "13/01/2021"', () => {
    const interval = 'd';
    const number = 120;
    const date = new Date(2020, 8, 15, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2021, 0, 13, 0, 0, 0);
    expect(actual).toEqual(expected);
  });
  test('should "15/09/2020 + 10 days (with D)" to be "25/09/2020"', () => {
    const interval = 'D';
    const number = 10;
    const date = new Date(2020, 8, 15, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2020, 8, 25, 0, 0, 0);
    expect(actual).toEqual(expected);
  });
  test('should "15/09/2020 + 70 days (with w)" to be "24/11/2020"', () => {
    const interval = 'w';
    const number = 70;
    const date = new Date(2020, 8, 15, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2020, 10, 24, 0, 0, 0);
    expect(actual).toEqual(expected);
  });
  test('should "15/09/2020 - 100 days (with W)" to be "07/06/2020"', () => {
    const interval = 'W';
    const number = -100;
    const date = new Date(2020, 8, 15, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2020, 5, 7, 0, 0, 0);
    expect(actual).toEqual(expected);
  });
  test('should "15/09/2020 + 1000 days (with y)" to be "12/06/2023"', () => {
    const interval = 'y';
    const number = 1000;
    const date = new Date(2020, 8, 15, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2023, 5, 12, 0, 0, 0);
    expect(actual).toEqual(expected);
  });
  test('should "15/09/2020 - 1000 days (with Y)" to be "20/12/2017"', () => {
    const interval = 'Y';
    const number = -1000;
    const date = new Date(2020, 8, 15, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2017, 11, 20, 0, 0, 0);
    expect(actual).toEqual(expected);
  });
  test('should "14/09/2020 00:00:00 + 2 months" to be "14/10/2020 00:00:00"', () => {
    const interval = DateInterval.Month;
    const number = 2;
    const date = new Date(2020, 8, 14, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2020, 10, 14, 0, 0, 0);
    expect(actual).toEqual(expected);
  });
  test('should "15/08/2020 + 100 months (with m)" to be "15/01/2029 00:00:00"', () => {
    const interval = 'm';
    const number = 100;
    const date = new Date(2020, 8, 15, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2029, 0, 15, 0, 0, 0);
    expect(actual).toEqual(expected);
  });
  test('should "15/08/2020 + 100 months (with M)" to be "15/01/2029 00:00:00"', () => {
    const interval = 'M';
    const number = 100;
    const date = new Date(2020, 8, 15, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2029, 0, 15, 0, 0, 0);
    expect(actual).toEqual(expected);
  });
  test('should "31/01/2023 + 1 month (with M)" to be "28/02/2023 00:00:00"', () => {
    const interval = 'M';
    const number = 1;
    const date = new Date(2023, 0, 31, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2023, 1, 28, 0, 0, 0);
    expect(actual).toEqual(expected);
  });
  test('should "31/01/2020 + 1 month (with M)" to be "29/02/2020 00:00:00"', () => {
    const interval = 'M';
    const number = 1;
    const date = new Date(2020, 0, 31, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2020, 1, 29, 0, 0, 0);
    expect(actual).toEqual(expected);
  });
  test('should "14/09/2020 00:00:00 + 1 year" to be "14/09/2021 00:00:00"', () => {
    const interval = DateInterval.Year;
    const number = 1;
    const date = new Date(2020, 8, 14, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2021, 8, 14, 0, 0, 0);
    expect(actual).toEqual(expected);
  });
  test('should "15/09/2020 + 1 year (with yyyy)" to be "15/09/2021"', () => {
    const interval = 'yyyy';
    const number = 1;
    const date = new Date(2020, 8, 15, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2021, 8, 15, 0, 0, 0);
    expect(actual).toEqual(expected);
  });
  test('should "15/09/2020 + 1 year (with YYYY)" to be "15/09/2021"', () => {
    const interval = 'YYYY';
    const number = 1;
    const date = new Date(2020, 8, 15, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2021, 8, 15, 0, 0, 0);
    expect(actual).toEqual(expected);
  });
  test('should "15/09/2020 + 100 quarter" to be "15/09/2045"', () => {
    const interval = DateInterval.Quarter;
    const number = 100;
    const date = new Date(2020, 8, 15, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2045, 8, 15, 0, 0, 0);
    expect(actual).toEqual(expected);
  });
  test('should "15/09/2020 + 100 quarter (with q)" to be "15/09/1995"', () => {
    const interval = 'q';
    const number = -100;
    const date = new Date(2020, 8, 15, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(1995, 8, 15, 0, 0, 0);
    expect(actual).toEqual(expected);
  });
  test('should "15/09/2020 + 50 quarter (with Q)" to be "15/03/2033"', () => {
    const interval = 'Q';
    const number = 50;
    const date = new Date(2020, 8, 15, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2033, 2, 15, 0, 0, 0);
    expect(actual).toEqual(expected);
  });
  test('should "15/09/2020 + 2 weeks" to be "29/09/2020"', () => {
    const interval = DateInterval.WeekOfYear;
    const number = 2;
    const date = new Date(2020, 8, 15, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2020, 8, 29, 0, 0, 0);
    expect(actual).toEqual(expected);
  });
  test('should "15/09/2020 - 2 weeks (with ww)" to be "01/09/2020"', () => {
    const interval = 'ww';
    const number = -2;
    const date = new Date(2020, 8, 15, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2020, 8, 1, 0, 0, 0);
    expect(actual).toEqual(expected);
  });
  test('should "15/09/2020 + 50 weeks (with WW)" to be "31/08/2021"', () => {
    const interval = 'WW';
    const number = 50;
    const date = new Date(2020, 8, 15, 0, 0, 0);
    const actual = VB6Helpers.DateAdd(interval, number, date);
    const expected = new Date(2021, 7, 31, 0, 0, 0);
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: DateDiff Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.DateDiff;
    expect(actual).toBeDefined();
  });
  test('should "15/09/2020 - 14/09/2020" to be 86400', () => {
    const interval = DateInterval.Second;
    const date1 = new Date(2020, 8, 14, 0, 0, 0);
    const date2 = new Date(2020, 8, 15, 0, 0, 0);
    const actual = VB6Helpers.DateDiff(interval, date1, date2);
    const expected = 86400;
    expect(actual).toEqual(expected);
  });
  test('should "15/09/2020 - 14/09/2020" to be 1440', () => {
    const interval = DateInterval.Minute;
    const date1 = new Date(2020, 8, 14, 0, 0, 0);
    const date2 = new Date(2020, 8, 15, 0, 0, 0);
    const actual = VB6Helpers.DateDiff(interval, date1, date2);
    const expected = 1440;
    expect(actual).toEqual(expected);
  });
  test('should "15/09/2020 - 14/09/2020" to be 24', () => {
    const interval = DateInterval.Hour;
    const date1 = new Date(2020, 8, 14, 0, 0, 0);
    const date2 = new Date(2020, 8, 15, 0, 0, 0);
    const actual = VB6Helpers.DateDiff(interval, date1, date2);
    const expected = 24;
    expect(actual).toEqual(expected);
  });
  test('should "15/09/2020 - 14/09/2020" to be 1', () => {
    const interval = DateInterval.Day;
    const date1 = new Date(2020, 8, 14, 0, 0, 0);
    const date2 = new Date(2020, 8, 15, 0, 0, 0);
    const actual = VB6Helpers.DateDiff(interval, date1, date2);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  test('should "14/11/2020 - 14/09/2020" to be 2', () => {
    const interval = DateInterval.Month;
    const date1 = new Date(2020, 8, 14, 0, 0, 0);
    const date2 = new Date(2020, 10, 14, 0, 0, 0);
    const actual = VB6Helpers.DateDiff(interval, date1, date2);
    const expected = 2;
    expect(actual).toEqual(expected);
  });
  test('should "14/09/2021 - 14/09/2020" to be 1', () => {
    const interval = DateInterval.Year;
    const date1 = new Date(2020, 8, 14, 0, 0, 0);
    const date2 = new Date(2021, 8, 14, 0, 0, 0);
    const actual = VB6Helpers.DateDiff(interval, date1, date2);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  test('should "14/09/2021 - 14/09/2020" to be 4', () => {
    const interval = DateInterval.Quarter;
    const date1 = new Date(2020, 8, 14, 0, 0, 0);
    const date2 = new Date(2021, 8, 14, 0, 0, 0);
    const actual = VB6Helpers.DateDiff(interval, date1, date2);
    const expected = 4;
    expect(actual).toEqual(expected);
  });
  test('should "14/09/2021 - 14/09/2020" to be 52', () => {
    const interval = DateInterval.WeekOfYear;
    const date1 = new Date(2020, 8, 14, 0, 0, 0);
    const date2 = new Date(2021, 8, 14, 0, 0, 0);
    const actual = VB6Helpers.DateDiff(interval, date1, date2);
    const expected = 52;
    expect(actual).toEqual(expected);
  });
  test('should "14/09/2020 - 15/09/2020" to be -1', () => {
    const interval = DateInterval.Day;
    const date1 = new Date(2020, 8, 15, 0, 0, 0);
    const date2 = new Date(2020, 8, 14, 0, 0, 0);
    const actual = VB6Helpers.DateDiff(interval, date1, date2);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  test('should "15/08/2020 - 14/08/2021" to be 1', () => {
    const interval = 'yyyy';
    const date1 = new Date(2020, 8, 15, 0, 0, 0);
    const date2 = new Date(2021, 8, 14, 0, 0, 0);
    const actual = VB6Helpers.DateDiff(interval, date1, date2);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  test('should "12/12/1950 - 16/12/2020" to be 70', () => {
    const interval = 'yyyy';
    const date1 = new Date(1950, 11, 12, 0, 0, 0);
    const date2 = new Date(2020, 11, 16, 0, 0, 0);
    const actual = VB6Helpers.DateDiff(interval, date1, date2);
    const expected = 70;
    expect(actual).toEqual(expected);
  });
  test('should "11/09/1951 - 01/02/2020" to be 69', () => {
    const interval = 'yyyy';
    const date1 = new Date(1951, 8, 11, 0, 0, 0);
    const date2 = new Date(2020, 1, 1, 0, 0, 0);
    const actual = VB6Helpers.DateDiff(interval, date1, date2);
    const expected = 69;
    expect(actual).toEqual(expected);
  });
  test('should "15/08/2020 - 14/08/2021" to be 364', () => {
    const interval = 'd';
    const date1 = new Date(2020, 8, 15, 0, 0, 0);
    const date2 = new Date(2021, 8, 14, 0, 0, 0);
    const actual = VB6Helpers.DateDiff(interval, date1, date2);
    const expected = 364;
    expect(actual).toEqual(expected);
  });
  test('should "15/08/2020 - 14/08/2021" to be 524160', () => {
    const interval = 'n';
    const date1 = new Date(2020, 8, 15, 0, 0, 0);
    const date2 = new Date(2021, 8, 14, 0, 0, 0);
    const actual = VB6Helpers.DateDiff(interval, date1, date2);
    const expected = 524160;
    expect(actual).toEqual(expected);
  });
  test('should "15/08/2020 - 14/08/2021" to be 52', () => {
    const interval = 'w';
    const date1 = new Date(2020, 8, 15, 0, 0, 0);
    const date2 = new Date(2021, 8, 14, 0, 0, 0);
    const actual = VB6Helpers.DateDiff(interval, date1, date2);
    const expected = 52;
    expect(actual).toEqual(expected);
  });
  test('should "15/08/2020 - 14/08/2021" to be 31449600', () => {
    const interval = 's';
    const date1 = new Date(2020, 8, 15, 0, 0, 0);
    const date2 = new Date(2021, 8, 14, 0, 0, 0);
    const actual = VB6Helpers.DateDiff(interval, date1, date2);
    const expected = 31449600;
    expect(actual).toEqual(expected);
  });
  test('should "15/08/2020 - 14/08/2021" to be 12', () => {
    const interval = 'M';
    const date1 = new Date(2020, 8, 15, 0, 0, 0);
    const date2 = new Date(2021, 8, 14, 0, 0, 0);
    const actual = VB6Helpers.DateDiff(interval, date1, date2);
    const expected = 12;
    expect(actual).toEqual(expected);
  });
  test('should "15/08/2020 - 14/08/2021" to be 12', () => {
    const interval = 'm';
    const date1 = new Date(2020, 8, 15, 0, 0, 0);
    const date2 = new Date(2021, 8, 14, 0, 0, 0);
    const actual = VB6Helpers.DateDiff(interval, date1, date2);
    const expected = 12;
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: DateToDouble Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.DateToDouble;
    expect(actual).toBeDefined();
  });
  test('should "2011/01/01" to be 40544', () => {
    const value = new Date(2011, 0, 1);
    const actual = VB6Helpers.DateToDouble(value);
    const expected = 40544;
    expect(actual).toEqual(expected);
  });
  test('should "2020/08/16" to be 44059', () => {
    const value = new Date(2020, 7, 16);
    const actual = VB6Helpers.DateToDouble(value);
    const expected = 44059;
    expect(actual).toEqual(expected);
  });
  test('should "2008/10/13" to be 39734', () => {
    const value = new Date(2008, 9, 13);
    const actual = VB6Helpers.DateToDouble(value);
    const expected = 39734;
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: DateSerial Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.DateSerial;
    expect(actual).toBeDefined();
  });
  test('should "DateSerial(2020, 35, 45)" to be "15/12/2022"', () => {
    const year = 2020;
    const month = 35;
    const day = 45;
    const actual = VB6Helpers.DateSerial(year, month, day);
    const expected = new Date(2022, 11, 15);
    expect(actual).toEqual(expected);
  });
  test('should "DateSerial(99, 1, 1)" to be "01/01/1999"', () => {
    const year = 99;
    const month = 1;
    const day = 1;
    const actual = VB6Helpers.DateSerial(year, month, day);
    const expected = new Date(1999, 0, 1);
    expect(actual).toEqual(expected);
  });
  test.skip('should "DateSerial(-200, 12, 11)" to be "11/10/1820"', () => {
    const year = -200;
    const month = 12;
    const day = 11;
    const actual = VB6Helpers.DateSerial(year, month, day);
    const expected = new Date(1820, 10, 11);
    expect(actual).toEqual(expected);
  });
  test.skip('should "DateSerial(-10, 45, 65)" to be "01/01/1999"', () => {
    const year = -10;
    const month = 45;
    const day = 65;
    const actual = VB6Helpers.DateSerial(year, month, day);
    const expected = new Date(1999, 0, 1);
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter is a "DateSerial(10000, 1, 1)"', () => {
    const year = 10000;
    const month = 1;
    const day = 1;
    const actual = VB6Helpers.DateSerial.bind(undefined, year, month, day);
    const expected = InvalidProcedureCallOrArgumentError;
    expect(actual).toThrow(expected);
  });
});

describe('VB6Helpers: Day Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Day;
    expect(actual).toBeDefined();
  });
  test('should null to be 1', () => {
    const value = null;
    const actual = VB6Helpers.Day(value);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  test('should "14/09/2020" to be "14"', () => {
    const value = new Date(2020, 8, 14);
    const actual = VB6Helpers.Day(value);
    const expected = 14;
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: Dir Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Dir;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: DoEvents Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.DoEvents;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: DoubleToDate Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.DoubleToDate;
    expect(actual).toBeDefined();
  });
  test('should 40544 to be "2011/01/01"', () => {
    const value = 40544;
    const actual = VB6Helpers.DoubleToDate(value);
    const expected = new Date(2011, 0, 1);
    expect(actual).toEqual(expected);
  });
  test('should 44059 to be "2020/08/16"', () => {
    const value = 44059;
    const actual = VB6Helpers.DoubleToDate(value);
    const expected = new Date(2020, 7, 16);
    expect(actual).toEqual(expected);
  });
  test('should 39734 to be "2008/10/13"', () => {
    const value = 39734;
    const actual = VB6Helpers.DoubleToDate(value);
    const expected = new Date(2008, 9, 13);
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: Environ Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Environ;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: EOF Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.EOF;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: Erase Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Erase;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: FileClose Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.FileClose;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: FileCopy Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.FileCopy;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: FileGetArray Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.FileGetArray;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: FileInputString Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.FileInputString;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: FileLineInput Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.FileLineInput;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: FileOpen Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.FileOpen;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: FilePrintLine Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.FilePrintLine;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: FilePut Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.FilePut;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: FileWriteLine Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.FileWriteLine;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: Fix Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Fix;
    expect(actual).toBeDefined();
  });
  test('should 1 to be 1', () => {
    const value = 1;
    const actual = VB6Helpers.Fix(value);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  test('should 1.5 to be 1', () => {
    const value = 1.5;
    const actual = VB6Helpers.Fix(value);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  test('should 2.5 to be 2', () => {
    const value = 2.5;
    const actual = VB6Helpers.Fix(value);
    const expected = 2;
    expect(actual).toEqual(expected);
  });
  test('should -2.5 to be -2', () => {
    const value = -2.5;
    const actual = VB6Helpers.Fix(value);
    const expected = -2;
    expect(actual).toEqual(expected);
  });
  test('should 1234.5678 to be 1234', () => {
    const value = 1234.5678;
    const actual = VB6Helpers.Fix(value);
    const expected = 1234;
    expect(actual).toEqual(expected);
  });
  test('should 123.45678 to be 123', () => {
    const value = 123.45678;
    const actual = VB6Helpers.Fix(value);
    const expected = 123;
    expect(actual).toEqual(expected);
  });
  test('should -123.4567 to be -123', () => {
    const value = -123.4567;
    const actual = VB6Helpers.Fix(value);
    const expected = -123;
    expect(actual).toEqual(expected);
  });
  test('should "-123.4567" to be -123', () => {
    const value = '-123.4567';
    const actual = VB6Helpers.Fix(value);
    const expected = -123;
    expect(actual).toEqual(expected);
  });
  test('should undefined to be 0', () => {
    const value = undefined;
    const actual = VB6Helpers.Fix(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should null to be null', () => {
    const value = null;
    const actual = VB6Helpers.Fix(value);
    const expected = null;
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter is a "abcd"', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Fix.bind(undefined, value);
    const expected = TypeMismatchError;
    expect(actual).toThrow(expected);
  });
  test('should true to be 1', () => {
    const value = true;
    const actual = VB6Helpers.Fix(value);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  test('should false to be 0', () => {
    const value = false;
    const actual = VB6Helpers.Fix(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: FontChangeName Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.FontChangeName;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: Format Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Format;
    expect(actual).toBeDefined();
  });
  test('should "HELLO" to be "hello"', () => {
    const value = 'HELLO';
    const actual = VB6Helpers.Format(value, '<');
    const expected = 'hello';
    expect(actual).toEqual(expected);
  });
  test('should "This is it" to be "THIS IS IT"', () => {
    const value = 'This is it';
    const actual = VB6Helpers.Format(value, '>');
    const expected = 'THIS IS IT';
    expect(actual).toEqual(expected);
  });
  test('should 5459.4 to be "5,459.40"', () => {
    const value = 5459.4;
    const actual = VB6Helpers.Format(value, '##,##0.00');
    const expected = '5,459.40';
    expect(actual).toEqual(expected);
  });
  test('should 334.9 to be "334.90"', () => {
    const value = 334.9;
    const actual = VB6Helpers.Format(value, '###0.00');
    const expected = '334.90';
    expect(actual).toEqual(expected);
  });
  test('should string "334.9" to be "334.90"', () => {
    const value = "334.9";
    const actual = VB6Helpers.Format(value, '###0.00', undefined, undefined, 'number');
    const expected = '334.90';
    expect(actual).toEqual(expected); 1
  });
  test('should string "10345269,13" to be "10.345.269,13"IT', () => {
    const value = "10345269,13";
    const actual = VB6Helpers.Format(value, '###,###,##0.00', undefined, undefined, 'number', 'it');
    const expected = '10.345.269,13';
    expect(actual).toEqual(expected);

    numeral.locale('en');
  });
  test('should string "1234,56" to be "1.234,56"', () => {
    const value = "1234,56";
    const actual = VB6Helpers.Format(value, '#,##0.00', undefined, undefined, 'number', 'it');
    const expected = '1.234,56';
    expect(actual).toEqual(expected);

    numeral.locale('en');
  });
  test('should 5 to be "500.00%"', () => {
    const value = 5;
    const actual = VB6Helpers.Format(value, '0.00%');
    const expected = '500.00%';
    expect(actual).toEqual(expected);
  });
  test('should "14/09/2020 17:04:23" to be "17:4:23"', () => {
    const value = new Date(2020, 8, 14, 17, 4, 23);
    // NOTES: 'h' for 12h format; 'H' for 24h format
    const actual = VB6Helpers.Format(value, 'H:m:s');
    const expected = '17:4:23';
    expect(actual).toEqual(expected);
  });
  test('should "14/09/2020 17:04:23" to be "05:04:23 pm"', () => {
    const value = new Date(2020, 8, 14, 17, 4, 23);
    // NOTES: 'a' for am/pm format
    const actual = VB6Helpers.Format(value, 'hh:mm:ss a');
    const expected = '05:04:23 pm';
    expect(actual).toEqual(expected);
  });
  test('should "14/09/2020 17:04:23" to be "05:04:23 PM"', () => {
    const value = new Date(2020, 8, 14, 17, 4, 23);
    // NOTES: 'A' for AM/PM format
    const actual = VB6Helpers.Format(value, 'hh:mm:ss A');
    const expected = '05:04:23 PM';
    expect(actual).toEqual(expected);
  });
  test('should "14/09/2020 17:04:23" to be "lunedì, set 14 2020"', () => {
    moment.locale('it');
    const value = new Date(2020, 8, 14, 17, 4, 23);
    // NOTES: 'MMM' for Jan Feb ... Nov Dec
    // NOTES: 'D' for 1 2 ... 30 31 day of month
    const actual = VB6Helpers.Format(value, 'dddd, MMM D yyyy');
    const expected = 'lunedì, set 14 2020';
    expect(actual).toEqual(expected);
  });
  test('should 23 to be "23"', () => {
    const value = 23;
    const actual = VB6Helpers.Format(value);
    const expected = '23';
    expect(actual).toEqual(expected);
  });
  test('should "6/15/2018 11:16:42 AM" to be "2018-06-15"', () => {
    const value = '6/15/2018 11:16:42 AM';
    const actual = VB6Helpers.Format(value, 'YYYY-MM-DD');
    const expected = '2018-06-15';
    expect(actual).toEqual(expected);
  });
  test('should "6/15/2018 11:16:42 AM" to be "2018/06/05"', () => {
    const value = '05/06/2018 11:16:42 AM';
    const actual = VB6Helpers.Format(value, 'YYYY/MM/DD');
    const expected = '2018/06/05';
    expect(actual).toEqual(expected);
  });
  test('should "15/6/2018 11:16:42 AM" to be "2018/06/15"', () => {
    const value = '15/6/2018 11:16:42 AM';
    const actual = VB6Helpers.Format(value, 'YYYY/MM/DD');
    const expected = '2018/06/15';
    expect(actual).toEqual(expected);
  });
  test('should "15-6-2018 11:16:42 AM" to be "2018-15-06"', () => {
    const value = '15/6/2018 11:16:42 AM';
    const actual = VB6Helpers.Format(value, 'YYYY-MM-DD');
    const expected = '2018-06-15';
    expect(actual).toEqual(expected);
  });
  test('should "6/15/2018 11:16:42 AM" to be "15/06/2018"', () => {
    const value = '6/15/2018 11:16:42 AM';
    const actual = VB6Helpers.Format(value, 'DD/MM/YYYY');
    const expected = '15/06/2018';
    expect(actual).toEqual(expected);
  });
  test('should "23/12/2018 11:16:42 AM" to be "23/12/2018"', () => {
    const value = '23/12/2018 11:16:42 AM';
    const actual = VB6Helpers.Format(value, 'DD/MM');
    const expected = '23/12';
    expect(actual).toEqual(expected);
  });
  test('should "6/5/2018 11:16:42 AM" to be "06/05/2018"', () => {
    const value = '06/05/2018 11:16:42 AM';
    const actual = VB6Helpers.Format(value, 'DD/MM/YYYY');
    const expected = '06/05/2018';
    expect(actual).toEqual(expected);
  });
  test('should "15/6/2018 11:16:42 AM" to be "15-06-2018"', () => {
    const value = '15/6/2018 11:16:42 AM';
    const actual = VB6Helpers.Format(value, 'DD-MM-YYYY');
    const expected = '15-06-2018';
    expect(actual).toEqual(expected);
  });
  test('should "15-6-2018 11:16:42 AM" to be "12-06-2018"', () => {
    const value = '15-6-2018 11:16:42 AM';
    const actual = VB6Helpers.Format(value, 'DD/MM/YYYY');
    const expected = '15/06/2018';
    expect(actual).toEqual(expected);
  });
  test('should "*6/15/2018 11:16:42 AM" to be "2018"', () => {
    const value = '6/15/2018 11:16:42 AM';
    const actual = VB6Helpers.Format(value, 'YYYY');
    const expected = '2018';
    expect(actual).toEqual(expected);
  });
  test('should "6/15/2018 11:16:42 PM" to be "15-06"', () => {
    const value = '6/15/2018 11:16:42 AM';
    const actual = VB6Helpers.Format(value, 'DD-MM');
    const expected = '15-06';
    expect(actual).toEqual(expected);
  });
  test('should "2018/06/15 11:16:42 PM" to be "2018-06"', () => {
    const value = '2018/06/15 11:16:42 PM';
    const actual = VB6Helpers.Format(value, 'YYYY-MM');
    const expected = '2018-06';
    expect(actual).toEqual(expected);
  });
  test.skip('should "06/05/2020 11:16:42" to be "05/06/2020"', () => {
    const value = '06/05/2020 11:16:42';
    const actual = VB6Helpers.Format(value, 'DD/MM/YYYY');
    const expected = '05/06/2020';
    expect(actual).toEqual(expected);
  });
  test.skip('should "06/05/2020" to be "05/06/2020"', () => {
    const value = '06/05/2020';
    const actual = VB6Helpers.Format(value, 'DD/MM/YYYY');
    const expected = '05/06/2020';
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: FreeFile Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.FreeFile;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: FromOleColor Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.FromOleColor;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: GetObject Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.GetObject;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: IIf Suite', () => {
  const a = 5;
  const b = 10;
  test('should be defined', () => {
    const actual = VB6Helpers.IIf;
    expect(actual).toBeDefined();
  });
  test('should IIf(5 > 10, "5 is Big", "10 is Big") to be "10 is Big"', () => {
    const actual = VB6Helpers.IIf(a > b, '5 is Big', '10 is Big');
    const expected = '10 is Big';
    expect(actual).toEqual(expected);
  });
  test('should IIf(5 === 10, "5 is equal to 10", "5 is not equal to 10") to be "5 is not equal to 10"', () => {
    const actual = VB6Helpers.IIf((a as any) === b, '5 is equal to 10', '5 is not equal to 10');
    const expected = '5 is not equal to 10';
    expect(actual).toEqual(expected);
  });
  test('should IIf(10 > 5, 10, 5) to be 10', () => {
    const actual = VB6Helpers.IIf(b > a, b, a);
    const expected = 10;
    expect(actual).toEqual(expected);
  });
  test('should IIf(true, "TRUE PART", "FALSE PART") to be "TRUE PART"', () => {
    const actual = VB6Helpers.IIf(true, 'TRUE PART', 'FALSE PART');
    const expected = 'TRUE PART';
    expect(actual).toEqual(expected);
  });
  test('should IIf(true, "TRUE PART", "FALSE PART") to be "FALSE PART"', () => {
    const actual = VB6Helpers.IIf(false, 'TRUE PART', 'FALSE PART');
    const expected = 'FALSE PART';
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: InputBox Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.InputBox;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: Instr Suite', () => {
  const searchStr = 'Chennaiiq';
  const searchChar = 'N';
  test('should be defined', () => {
    const actual = VB6Helpers.Instr;
    expect(actual).toBeDefined();
  });
  test('should Instr(1, "Chennaiiq", "N", 1) to be 4', () => {
    const actual = VB6Helpers.Instr(1, searchStr, searchChar, 1);
    const expected = 4;
    expect(actual).toEqual(expected);
  });
  test('should Instr(1, "Chennaiiq", "N", 0) to be 0', () => {
    const actual = VB6Helpers.Instr(1, searchStr, searchChar, 0);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should Instr(5, "Chennaiiq", "N", 1) to be 5', () => {
    const actual = VB6Helpers.Instr(5, searchStr, searchChar, 1);
    const expected = 5;
    expect(actual).toEqual(expected);
  });
  test('should Instr(6, "Chennaiiq", "N", 1) to be 0', () => {
    const actual = VB6Helpers.Instr(6, searchStr, searchChar, 1);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should Instr("Chennaiiq", LCase("N")) to be 4', () => {
    const actual = VB6Helpers.Instr(searchStr, VB6Helpers.LCase(searchChar));
    const expected = 4;
    expect(actual).toEqual(expected);
  });
  test('should Instr("", "N") to be 0', () => {
    const actual = VB6Helpers.Instr('', searchChar);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should Instr(4, "Chennaiiq", "") to be 4', () => {
    const actual = VB6Helpers.Instr(4, searchStr, '');
    const expected = 4;
    expect(actual).toEqual(expected);
  });
  test('should Instr(null, "N") to be 0', () => {
    const actual = VB6Helpers.Instr(null, searchChar);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should Instr("Chennaiiq", null) to be 1', () => {
    const actual = VB6Helpers.Instr(searchStr, null);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: InstrRev Suite', () => {
  const searchStr = 'Chennaiiq';
  const searchChar = 'N';
  test('should be defined', () => {
    const actual = VB6Helpers.InstrRev;
    expect(actual).toBeDefined();
  });
  test('should InstrRev("Chennaiiq", "N", -1, 1) to be 5', () => {
    const actual = VB6Helpers.InstrRev(searchStr, searchChar, -1, 1);
    const expected = 5;
    expect(actual).toEqual(expected);
  });
  test('should InstrRev("Chennaiiq", "N", -1, 0) to be 0', () => {
    const actual = VB6Helpers.InstrRev(searchStr, searchChar, -1, 0);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should InstrRev("Chennaiiq", "N", 4, 1) to be 4', () => {
    const actual = VB6Helpers.InstrRev(searchStr, searchChar, 4, 1);
    const expected = 4;
    expect(actual).toEqual(expected);
  });
  test('should InstrRev("Chennaiiq", "N", 6, 1) to be 5', () => {
    const actual = VB6Helpers.InstrRev(searchStr, searchChar, 6, 1);
    const expected = 5;
    expect(actual).toEqual(expected);
  });
  test('should InstrRev("Chennaiiq", LCase("N")) to be 5', () => {
    const actual = VB6Helpers.InstrRev(searchStr, VB6Helpers.LCase(searchChar));
    const expected = 5;
    expect(actual).toEqual(expected);
  });
  test('should InstrRev("", "N") to be 0', () => {
    const actual = VB6Helpers.InstrRev('', searchChar);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should InstrRev("Chennaiiq", "") to be 9', () => {
    const actual = VB6Helpers.InstrRev(searchStr, '');
    const expected = 9;
    expect(actual).toEqual(expected);
  });
  test('should InstrRev(null, "Chennaiiq") to be 0', () => {
    const actual = VB6Helpers.InstrRev(null, searchChar);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should InstrRev("Chennaiiq", null) to be 9', () => {
    const actual = VB6Helpers.InstrRev(searchStr, null);
    const expected = 9;
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: Int Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Int;
    expect(actual).toBeDefined();
  });
  test('should Int(1) to be 1', () => {
    const value = 1;
    const actual = VB6Helpers.Int(value);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  test('should Int(1.5) to be 1', () => {
    const value = 1.5;
    const actual = VB6Helpers.Int(value);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  test('should Int(2.5) to be 2', () => {
    const value = 2.5;
    const actual = VB6Helpers.Int(value);
    const expected = 2;
    expect(actual).toEqual(expected);
  });
  test('should Int(-2.5) to be -3', () => {
    const value = -2.5;
    const actual = VB6Helpers.Int(value);
    const expected = -3;
    expect(actual).toEqual(expected);
  });
  test('should Int(1234.5678) to be 1234', () => {
    const value = 1234.5678;
    const actual = VB6Helpers.Int(value);
    const expected = 1234;
    expect(actual).toEqual(expected);
  });
  test('should Int(123.5678) to be 123', () => {
    const value = 123.5678;
    const actual = VB6Helpers.Int(value);
    const expected = 123;
    expect(actual).toEqual(expected);
  });
  test('should Int(-123.4567) to be -124', () => {
    const value = -123.4567;
    const actual = VB6Helpers.Int(value);
    const expected = -124;
    expect(actual).toEqual(expected);
  });
  test('should Int("-123.4567") to be -124', () => {
    const value = '-123.4567';
    const actual = VB6Helpers.Int(value);
    const expected = -124;
    expect(actual).toEqual(expected);
  });
  test('should undefined to be 0', () => {
    const value = undefined;
    const actual = VB6Helpers.Int(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should null to be null', () => {
    const value = null;
    const actual = VB6Helpers.Int(value);
    const expected = null;
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter is a "abcd"', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Int.bind(undefined, value);
    const expected = TypeMismatchError;
    expect(actual).toThrow(expected);
  });
  test('should true to be -1', () => {
    const value = true;
    const actual = VB6Helpers.Int(value);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  test('should false to be 0', () => {
    const value = false;
    const actual = VB6Helpers.Int(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: Invoke Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Invoke;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: IsArray Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.IsArray;
    expect(actual).toBeDefined();
  });
  test('should 1 to be false', () => {
    const value = 1;
    const actual = VB6Helpers.IsArray(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should string to be false', () => {
    let value: string = '';
    const actual = VB6Helpers.IsArray(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should ["a", "b"] to be true', () => {
    const value = ['a', 'b'];
    const actual = VB6Helpers.IsArray(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should [1, 2, 3] to be true', () => {
    const value = [1, 2, 3];
    const actual = VB6Helpers.IsArray(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should Date to be false', () => {
    let value = new Date;
    const actual = VB6Helpers.IsArray(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should number to be false', () => {
    let value: number = 1;
    const actual = VB6Helpers.IsArray(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should boolean to be false', () => {
    let value: boolean = true;
    const actual = VB6Helpers.IsArray(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should "a-b-c".split("-") to be true', () => {
    const value = 'a-b-c'.split('-');
    const actual = VB6Helpers.IsArray(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should undefined to be false', () => {
    const value = undefined;
    const actual = VB6Helpers.IsArray(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should true to be false', () => {
    const value = true;
    const actual = VB6Helpers.IsArray(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should false to be false', () => {
    const value = false;
    const actual = VB6Helpers.IsArray(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should null to be false', () => {
    const value = null;
    const actual = VB6Helpers.IsArray(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should 0 to be false', () => {
    const value = 0;
    const actual = VB6Helpers.IsArray(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should "abcd" to be false', () => {
    const value = "abcd";
    const actual = VB6Helpers.IsArray(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: IsDate Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.IsDate;
    expect(actual).toBeDefined();
  });
  test('should 1 to be false', () => {
    const value = 1;
    const actual = VB6Helpers.IsDate(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should "ABCD" to be false', () => {
    let value = 'ABCD';
    const actual = VB6Helpers.IsDate(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should ["a", "b"] to be false', () => {
    const value = ['a', 'b'];
    const actual = VB6Helpers.IsDate(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should Date to be true', () => {
    let value = new Date;
    const actual = VB6Helpers.IsDate(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should "January 01 2000" to be true', () => {
    let value = 'January 01 2000';
    const actual = VB6Helpers.IsDate(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should "2020/09/15" to be true', () => {
    let value = '2020/09/15';
    const actual = VB6Helpers.IsDate(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should "2020-09-15" to be true', () => {
    let value = '2020-09-15';
    const actual = VB6Helpers.IsDate(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should "15/09/2020 to be true', () => {
    let value = '15/09/2020';
    const actual = VB6Helpers.IsDate(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should "15/09/2020 12:45:51 to be true', () => {
    let value = '15/09/2020 12:45:51';
    const actual = VB6Helpers.IsDate(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should "15-09-2020" to be true', () => {
    let value = '15-09-2020';
    const actual = VB6Helpers.IsDate(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should "09/15/2020 to be true', () => {
    let value = '09/15/2020';
    const actual = VB6Helpers.IsDate(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should "09-15-2020" to be true', () => {
    let value = '09-15-2020';
    const actual = VB6Helpers.IsDate(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should "1234abcd" to be false', () => {
    let value = '1234abcd';
    const actual = VB6Helpers.IsDate(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should number to be false', () => {
    let value: number = 1;
    const actual = VB6Helpers.IsDate(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should boolean to be false', () => {
    let value: boolean = true;
    const actual = VB6Helpers.IsDate(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should undefined to be false', () => {
    const value = undefined;
    const actual = VB6Helpers.IsDate(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should true to be false', () => {
    const value = true;
    const actual = VB6Helpers.IsDate(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should false to be false', () => {
    const value = false;
    const actual = VB6Helpers.IsDate(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should null to be false', () => {
    const value = null;
    const actual = VB6Helpers.IsDate(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should 0 to be false', () => {
    const value = 0;
    const actual = VB6Helpers.IsDate(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should "abcd" to be false', () => {
    const value = "abcd";
    const actual = VB6Helpers.IsDate(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: IsEmpty Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.IsEmpty;
    expect(actual).toBeDefined();
  });
  test('should 1 to be false', () => {
    const value = 1;
    const actual = VB6Helpers.IsEmpty(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should "ABCD" to be false', () => {
    let value = 'ABCD';
    const actual = VB6Helpers.IsEmpty(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should ["a", "b"] to be false', () => {
    const value = ['a', 'b'];
    const actual = VB6Helpers.IsEmpty(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should Date to be false', () => {
    let value = new Date;
    const actual = VB6Helpers.IsEmpty(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should "2020/09/15" to be false', () => {
    let value = '2020/09/15';
    const actual = VB6Helpers.IsEmpty(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should "1234abcd" to be false', () => {
    let value = '1234abcd';
    const actual = VB6Helpers.IsEmpty(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should number to be false', () => {
    let value: number = 1;
    const actual = VB6Helpers.IsEmpty(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should boolean to be false', () => {
    let value: boolean = true;
    const actual = VB6Helpers.IsEmpty(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should undefined to be true', () => {
    const value = undefined;
    const actual = VB6Helpers.IsEmpty(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should object to be true', () => {
    let value: object;
    const actual = VB6Helpers.IsEmpty(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should true to be false', () => {
    const value = true;
    const actual = VB6Helpers.IsEmpty(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should false to be false', () => {
    const value = false;
    const actual = VB6Helpers.IsEmpty(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should null to be false', () => {
    const value = null;
    const actual = VB6Helpers.IsEmpty(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should 0 to be false', () => {
    const value = 0;
    const actual = VB6Helpers.IsEmpty(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should "abcd" to be false', () => {
    const value = "abcd";
    const actual = VB6Helpers.IsEmpty(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: IsMissing Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.IsMissing;
    expect(actual).toBeDefined();
  });
  test('should 1 to be false', () => {
    const value = 1;
    const actual = VB6Helpers.IsMissing(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should "ABCD" to be false', () => {
    let value = 'ABCD';
    const actual = VB6Helpers.IsMissing(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should ["a", "b"] to be false', () => {
    const value = ['a', 'b'];
    const actual = VB6Helpers.IsMissing(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should Date to be false', () => {
    let value = new Date;
    const actual = VB6Helpers.IsMissing(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should "2020/09/15" to be false', () => {
    let value = '2020/09/15';
    const actual = VB6Helpers.IsMissing(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should "1234abcd" to be false', () => {
    let value = '1234abcd';
    const actual = VB6Helpers.IsMissing(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should number to be false', () => {
    let value: number = 1;
    const actual = VB6Helpers.IsMissing(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should boolean to be false', () => {
    let value: boolean = true;
    const actual = VB6Helpers.IsMissing(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should undefined to be true', () => {
    const value = undefined;
    const actual = VB6Helpers.IsMissing(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should object to be true', () => {
    let value: object;
    const actual = VB6Helpers.IsMissing(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should true to be false', () => {
    const value = true;
    const actual = VB6Helpers.IsMissing(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should false to be false', () => {
    const value = false;
    const actual = VB6Helpers.IsMissing(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should null to be false', () => {
    const value = null;
    const actual = VB6Helpers.IsMissing(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should 0 to be false', () => {
    const value = 0;
    const actual = VB6Helpers.IsMissing(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should "abcd" to be false', () => {
    const value = "abcd";
    const actual = VB6Helpers.IsMissing(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: IsNull Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.IsNull;
    expect(actual).toBeDefined();
  });
  test('should 1 to be false', () => {
    const value = 1;
    const actual = VB6Helpers.IsNull(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should "ABCD" to be false', () => {
    let value = 'ABCD';
    const actual = VB6Helpers.IsNull(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should ["a", "b"] to be false', () => {
    const value = ['a', 'b'];
    const actual = VB6Helpers.IsNull(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should Date to be false', () => {
    let value = new Date;
    const actual = VB6Helpers.IsNull(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should "2020/09/15" to be false', () => {
    let value = '2020/09/15';
    const actual = VB6Helpers.IsNull(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should "1234abcd" to be false', () => {
    let value = '1234abcd';
    const actual = VB6Helpers.IsNull(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should number to be false', () => {
    let value: number = 1;
    const actual = VB6Helpers.IsNull(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should boolean to be false', () => {
    let value: boolean = true;
    const actual = VB6Helpers.IsNull(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should undefined to be false', () => {
    const value = undefined;
    const actual = VB6Helpers.IsNull(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should null to be true', () => {
    let value = null;
    const actual = VB6Helpers.IsNull(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should true to be false', () => {
    const value = true;
    const actual = VB6Helpers.IsNull(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should false to be false', () => {
    const value = false;
    const actual = VB6Helpers.IsNull(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should 0 to be false', () => {
    const value = 0;
    const actual = VB6Helpers.IsNull(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should "abcd" to be false', () => {
    const value = "abcd";
    const actual = VB6Helpers.IsNull(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: IsNumeric Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.IsNumeric;
    expect(actual).toBeDefined();
  });
  test('should 1 to be true', () => {
    const value = 1;
    const actual = VB6Helpers.IsNumeric(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should "ABCD" to be false', () => {
    let value = 'ABCD';
    const actual = VB6Helpers.IsNumeric(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should "1234" to be true', () => {
    let value = '1234';
    const actual = VB6Helpers.IsNumeric(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should ["a", "b"] to be false', () => {
    const value = ['a', 'b'];
    const actual = VB6Helpers.IsNumeric(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should Asc("ABCD") to be true', () => {
    let value = 'ABCD';
    const actual = VB6Helpers.IsNumeric(VB6Helpers.Asc(value));
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should Date to be false', () => {
    let value = new Date;
    const actual = VB6Helpers.IsNumeric(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should "2020/09/15" to be false', () => {
    let value = '2020/09/15';
    const actual = VB6Helpers.IsNumeric(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should "1234abcd" to be false', () => {
    let value = '1234abcd';
    const actual = VB6Helpers.IsNumeric(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should number to be true', () => {
    let value: number = 1;
    const actual = VB6Helpers.IsNumeric(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should boolean to be true', () => {
    let value: boolean = true;
    const actual = VB6Helpers.IsNumeric(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test.skip('should undefined to be true', () => {
    const value = undefined;
    const actual = VB6Helpers.IsNumeric(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should null to be false', () => {
    let value = null;
    const actual = VB6Helpers.IsNumeric(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should true to be true', () => {
    const value = true;
    const actual = VB6Helpers.IsNumeric(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should false to be true', () => {
    const value = false;
    const actual = VB6Helpers.IsNumeric(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should 0 to be true', () => {
    const value = 0;
    const actual = VB6Helpers.IsNumeric(value);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  test('should "abcd" to be false', () => {
    const value = 'abcd';
    const actual = VB6Helpers.IsNumeric(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  test('should "" to be false', () => {
    const value = '';
    const actual = VB6Helpers.IsNumeric(value);
    const expected = false;
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: Join Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Join;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: LBound Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.LBound;
    expect(actual).toBeDefined();
  });
  test('should "[[1, 2, 3], [4, 5, 6]]" with rank 1 to be 0', () => {
    const value = [[1, 2, 3], [4, 5, 6]];
    const actual = VB6Helpers.LBound(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should "[[1, 2, 3], [4, 5, 6]]" with rank 2 to be 0', () => {
    const value = [[1, 2, 3], [4, 5, 6]];
    const actual = VB6Helpers.LBound(value, 2);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should "[[1, 2, 3], [4, 5, 6]]" with rank 3 to be 0', () => {
    const value = [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]];
    const actual = VB6Helpers.LBound(value, 3);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should throw error when "[[1, 2, 3], [4, 5, 6]]" with rank 3', () => {
    const value = [[1, 2, 3], [4, 5, 6]];
    const actual = VB6Helpers.LBound.bind(undefined, value, 3);
    const expected = IndexOutOfRangeError;
    expect(actual).toThrow(expected);
  });
});

describe('VB6Helpers: LCase Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.LCase;
    expect(actual).toBeDefined();
  });
  test('should "ABCD" to be "abcd"', () => {
    const value = 'ABCD';
    const actual = VB6Helpers.LCase(value);
    const expected = 'abcd';
    expect(actual).toEqual(expected);
  });
  test('should "Abcd" to be "abcd"', () => {
    const value = 'Abcd';
    const actual = VB6Helpers.LCase(value);
    const expected = 'abcd';
    expect(actual).toEqual(expected);
  });
  test('should "VB 6.0" to be "vb 6.0"', () => {
    const value = 'VB 6.0';
    const actual = VB6Helpers.LCase(value);
    const expected = 'vb 6.0';
    expect(actual).toEqual(expected);
  });
  test('should 1 to be "1"', () => {
    const value = 1;
    const actual = VB6Helpers.LCase(value);
    const expected = '1';
    expect(actual).toEqual(expected);
  });
  test('should true to be "true"', () => {
    const value = true;
    const actual = VB6Helpers.LCase(value);
    const expected = 'true';
    expect(actual).toEqual(expected);
  });
  test('should false to be "false"', () => {
    const value = false;
    const actual = VB6Helpers.LCase(value);
    const expected = 'false';
    expect(actual).toEqual(expected);
  });
  test('should null to be null', () => {
    const value = null;
    const actual = VB6Helpers.LCase(value);
    const expected = null;
    expect(actual).toEqual(expected);
  });
  test('should undefined to be ""', () => {
    const value = undefined;
    const actual = VB6Helpers.LCase(value);
    const expected = '';
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: Left Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Left;
    expect(actual).toBeDefined();
  });
  test('should Left("abcd", 2) to be "ab"', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Left(value, 2);
    const expected = 'ab';
    expect(actual).toEqual(expected);
  });
  test('should Left("abcd", 0) to be ""', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Left(value, 0);
    const expected = '';
    expect(actual).toEqual(expected);
  });
  test('should Left("abcd", 5) to be "abcd"', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Left(value, 5);
    const expected = 'abcd';
    expect(actual).toEqual(expected);
  });
  test('should Left("abcd", 4) to be "abcd"', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Left(value, 4);
    const expected = 'abcd';
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter are Left("abcd", -1)', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Left.bind(undefined, value, -1);
    const expected = InvalidProcedureCallOrArgumentError
    expect(actual).toThrow(expected);
  });
  test('should throw error when parameter are Left("abcd", null)', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Left.bind(undefined, value, null);
    const expected = InvalidUseOfNullError
    expect(actual).toThrow(expected);
  });
  test('should Left(null, 2) to be null', () => {
    const value = null;
    const actual = VB6Helpers.Left(value, 2);
    const expected = null;
    expect(actual).toEqual(expected);
  });
  test('should Left("True", 3) to be "Tru"', () => {
    const value = 'True';
    const actual = VB6Helpers.Left(value, 3);
    const expected = 'Tru';
    expect(actual).toEqual(expected);
  });
  test('should Left("False", 3) to be "Fal"', () => {
    const value = 'False';
    const actual = VB6Helpers.Left(value, 3);
    const expected = 'Fal';
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter are Left("abcd", true)', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Left.bind(undefined, value, true);
    const expected = InvalidProcedureCallOrArgumentError
    expect(actual).toThrow(expected);
  });
  test('should Left("abcd", false) to be ""', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Left(value, false);
    const expected = '';
    expect(actual).toEqual(expected);
  });
  test('should Left(undefined, 3) to be ""', () => {
    const value = undefined;
    const actual = VB6Helpers.Left(value, 3);
    const expected = '';
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: Len Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Len;
    expect(actual).toBeDefined();
  });
  test('should "abcd" to be 4', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Len(value);
    const expected = 4;
    expect(actual).toEqual(expected);
  });
  test('should "" to be 0', () => {
    const value = '';
    const actual = VB6Helpers.Len(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should null to be null', () => {
    const value = null;
    const actual = VB6Helpers.Len(value);
    const expected = null;
    expect(actual).toEqual(expected);
  });
  test('should 140 to be 2', () => {
    const value = 140;
    const actual = VB6Helpers.Len(value);
    const expected = 2;
    expect(actual).toEqual(expected);
  });
  test('should true to be 4', () => {
    const value = true;
    const actual = VB6Helpers.Len(value);
    const expected = 4;
    expect(actual).toEqual(expected);
  });
  test('should false to be 4', () => {
    const value = false;
    const actual = VB6Helpers.Len(value);
    const expected = 4;
    expect(actual).toEqual(expected);
  });
  test('should undefined to be 0', () => {
    const value = undefined;
    const actual = VB6Helpers.Len(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: Like Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Like;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: LoadForm Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.LoadForm;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: LOF Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.LOF;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: Mid Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Mid;
    expect(actual).toBeDefined();
  });
  test('should Mid("abcd", 2) to be "bcd', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Mid(value, 2);
    const expected = 'bcd';
    expect(actual).toEqual(expected);
  });
  test('should Mid("abcd", 1) to be "abcd"', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Mid(value, 1);
    const expected = 'abcd';
    expect(actual).toEqual(expected);
  });
  test('should Mid("abcd", 0) to be ""', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Mid(value, 0);
    const expected = '';
    expect(actual).toEqual(expected);
  });
  test('should Mid("abcd", 5) to be ""', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Mid(value, 5);
    const expected = '';
    expect(actual).toEqual(expected);
  });
  test('should Mid("abcd", 2, 2) to be "bc"', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Mid(value, 2, 2);
    const expected = 'bc';
    expect(actual).toEqual(expected);
  });
  test('should Mid("abcd", 1, 1) to be "a"', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Mid(value, 1, 1);
    const expected = 'a';
    expect(actual).toEqual(expected);
  });
  test('should Mid("abcd", 2, 1) to be "b"', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Mid(value, 2, 1);
    const expected = 'b';
    expect(actual).toEqual(expected);
  });
  test('should Mid("abcd", 3, 1) to be "c"', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Mid(value, 3, 1);
    const expected = 'c';
    expect(actual).toEqual(expected);
  });
  test('should Mid("abcd", 4, 1) to be "d"', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Mid(value, 4, 1);
    const expected = 'd';
    expect(actual).toEqual(expected);
  });
  test('should Mid("abcd", 5, 1) to be ""', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Mid(value, 5, 1);
    const expected = '';
    expect(actual).toEqual(expected);
  });
  test('should Mid("abcd", 5, 2) to be ""', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Mid(value, 5, 2);
    const expected = '';
    expect(actual).toEqual(expected);
  });
  test('should Mid("abcd", 1, 4) to be "abcd"', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Mid(value, 1, 4);
    const expected = 'abcd';
    expect(actual).toEqual(expected);
  });
  test('should Mid("abcd", 1, Len("abcd")) to be "abcd"', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Mid(value, 1, VB6Helpers.Len('abcd'));
    const expected = 'abcd';
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter are Mid("abcd", null)', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Mid.bind(undefined, value, null);
    const expected = InvalidUseOfNullError
    expect(actual).toThrow(expected);
  });
  test('should throw error when parameter are Mid("abcd", 3, null)', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Mid.bind(undefined, value, 3, null);
    const expected = InvalidUseOfNullError
    expect(actual).toThrow(expected);
  });
  test('should Mid(null, 3, 2) to be null', () => {
    const value = null;
    const actual = VB6Helpers.Mid(value, 3, 2);
    const expected = null;
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter are Mid("abcd", true)', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Mid.bind(undefined, value, true);
    const expected = InvalidProcedureCallOrArgumentError
    expect(actual).toThrow(expected);
  });
  test('should throw error when parameter are Mid("abcd", false)', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Mid.bind(undefined, value, false);
    const expected = InvalidProcedureCallOrArgumentError
    expect(actual).toThrow(expected);
  });
  test('should Mid(undefined, 3) to be ""', () => {
    const value = undefined;
    const actual = VB6Helpers.Mid(value, 3);
    const expected = '';
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: MidSet Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.MidSet;
    expect(actual).toBeDefined();
  });
  test('should throw error when parameter are MidSet(undefined, 1, "ef")', () => {
    const value = undefined;
    const valueOrLength = 'ef';
    const actual = VB6Helpers.MidSet.bind(undefined, value, 1, valueOrLength);
    const expected = InvalidProcedureCallOrArgumentError;
    expect(actual).toThrow(expected);
  });
  test('should throw error when parameter are MidSet(null, 1, "ef")', () => {
    const value = null;
    const valueOrLength = 'ef';
    const actual = VB6Helpers.MidSet.bind(undefined, value, 1, valueOrLength);
    const expected = InvalidProcedureCallOrArgumentError;
    expect(actual).toThrow(expected);
  });
  test('should throw error when parameter are MidSet("", 1, "ef")', () => {
    const value = '';
    const valueOrLength = 'ef';
    const actual = VB6Helpers.MidSet.bind(undefined, value, 1, valueOrLength);
    const expected = InvalidProcedureCallOrArgumentError;
    expect(actual).toThrow(expected);
  });
  test('should throw error when parameter are MidSet("abcd", 0, "")', () => {
    const value = 'abcd';
    const valueOrLength = '';
    const actual = VB6Helpers.MidSet.bind(undefined, value, 0, valueOrLength);
    const expected = InvalidProcedureCallOrArgumentError;
    expect(actual).toThrow(expected);
  });
  test('should MidSet("abcd", 1, "") to be "abcd"', () => {
    const value = 'abcd';
    const valueOrLength = '';
    const actual = VB6Helpers.MidSet(value, 1, valueOrLength);
    const expected = 'abcd';
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter are MidSet("abcd", 0, "ef")', () => {
    const value = 'abcd';
    const valueOrLength = 'ef';
    const actual = VB6Helpers.MidSet.bind(undefined, value, 0, valueOrLength);
    const expected = InvalidProcedureCallOrArgumentError;
    expect(actual).toThrow(expected);
  });
  test('should MidSet("abcd", 1, "ef") to be "efcd"', () => {
    const value = 'abcd';
    const valueOrLength = 'ef';
    const actual = VB6Helpers.MidSet(value, 1, valueOrLength);
    const expected = 'efcd';
    expect(actual).toEqual(expected);
  });
  test('should MidSet("abcd", 2, "ef") to be "aefd"', () => {
    const value = 'abcd';
    const valueOrLength = 'ef';
    const actual = VB6Helpers.MidSet(value, 2, valueOrLength);
    const expected = 'aefd';
    expect(actual).toEqual(expected);
  });
  test('should MidSet("abcd", 3, "ef") to be "abef"', () => {
    const value = 'abcd';
    const valueOrLength = 'ef';
    const actual = VB6Helpers.MidSet(value, 3, valueOrLength);
    const expected = 'abef';
    expect(actual).toEqual(expected);
  });
  test('should MidSet("abcd", 4, "ef") to be "abce"', () => {
    const value = 'abcd';
    const valueOrLength = 'ef';
    const actual = VB6Helpers.MidSet(value, 4, valueOrLength);
    const expected = 'abce';
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter are MidSet("abcd", 5, "ef")', () => {
    const value = 'abcd';
    const valueOrLength = 'ef';
    const actual = VB6Helpers.MidSet.bind(undefined, value, 5, valueOrLength);
    const expected = InvalidProcedureCallOrArgumentError;
    expect(actual).toThrow(expected);
  });
  test('should MidSet("abcd", 1, "efgh") to be "efgh"', () => {
    const value = 'abcd';
    const valueOrLength = 'efgh';
    const actual = VB6Helpers.MidSet(value, 1, valueOrLength);
    const expected = 'efgh';
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter are MidSet("abcd", 0, 1, "ef")', () => {
    const value = 'abcd';
    const valueOrLength = 'ef';
    const actual = VB6Helpers.MidSet.bind(undefined, value, 0, 1, valueOrLength);
    const expected = InvalidProcedureCallOrArgumentError;
    expect(actual).toThrow(expected);
  });
  test('should MidSet("abcd", 1, 1, "ef") to be "ebcd"', () => {
    const value = 'abcd';
    const valueOrLength = 'ef';
    const actual = VB6Helpers.MidSet(value, 1, 1, valueOrLength);
    const expected = 'ebcd';
    expect(actual).toEqual(expected);
  });
  test('should MidSet("abcd", 2, 1, "ef") to be "ebcd"', () => {
    const value = 'abcd';
    const valueOrLength = 'ef';
    const actual = VB6Helpers.MidSet(value, 2, 1, valueOrLength);
    const expected = 'aecd';
    expect(actual).toEqual(expected);
  });
  test('should MidSet("abcd", 2, 2, "ef") to be "aefd"', () => {
    const value = 'abcd';
    const valueOrLength = 'ef';
    const actual = VB6Helpers.MidSet(value, 2, 2, valueOrLength);
    const expected = 'aefd';
    expect(actual).toEqual(expected);
  });
  test('should MidSet("abcd", 3, 2, "ef") to be "abef"', () => {
    const value = 'abcd';
    const valueOrLength = 'ef';
    const actual = VB6Helpers.MidSet(value, 3, 2, valueOrLength);
    const expected = 'abef';
    expect(actual).toEqual(expected);
  });
  test('should MidSet("abcd", 3, 3, "ef") to be "abef"', () => {
    const value = 'abcd';
    const valueOrLength = 'ef';
    const actual = VB6Helpers.MidSet(value, 3, 3, valueOrLength);
    const expected = 'abef';
    expect(actual).toEqual(expected);
  });
  test('should MidSet("abcd", 4, 0, "ef") to be "abcd"', () => {
    const value = 'abcd';
    const valueOrLength = 'ef';
    const actual = VB6Helpers.MidSet(value, 4, 0, valueOrLength);
    const expected = 'abcd';
    expect(actual).toEqual(expected);
  });
  test('should MidSet("abcd", 4, 1, "ef") to be "abce"', () => {
    const value = 'abcd';
    const valueOrLength = 'ef';
    const actual = VB6Helpers.MidSet(value, 4, 1, valueOrLength);
    const expected = 'abce';
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: MkDir Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.MkDir;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: Month Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Month;
    expect(actual).toBeDefined();
  });
  test('should "2020/09/16" to be "9"', () => {
    const value = new Date(2020, 8, 16);
    const actual = VB6Helpers.Month(value);
    const expected = 9;
    expect(actual).toEqual(expected);
  });
  test('should DateAdd("q", 1, "2020/09/16") to be "12"', () => {
    const value = VB6Helpers.DateAdd(DateInterval.Quarter, 1, new Date(2020, 8, 16));
    const actual = VB6Helpers.Month(value);
    const expected = 12;
    expect(actual).toEqual(expected);
  });
  test('should undefined to be undefined', () => {
    const value = undefined;
    const actual = VB6Helpers.Month(value);
    const expected = undefined;
    expect(actual).toEqual(expected);
  });
  test('should null to be null', () => {
    const value = null;
    const actual = VB6Helpers.Month(value);
    const expected = null;
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: MsgBox Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.MsgBox;
    expect(actual).toBeDefined();
  });
  test('should MsgBox open an alert modal', () => {
    const jsdomAlert = window.alert;
    window.alert = () => { };
    const spy = jest.spyOn(window, 'alert');
    VB6Helpers.MsgBox('Test');
    expect(spy).toHaveBeenCalled();
    window.alert = jsdomAlert;
  });
  test('should MsgBox open a confirm modal', () => {
    const jsdomConfirm = window.confirm;
    window.confirm = () => { return true };
    const spy = jest.spyOn(window, 'confirm');
    VB6Helpers.MsgBox('Test', MsgBoxStyle.OkOnly);
    expect(spy).toHaveBeenCalled();
    window.confirm = jsdomConfirm;
  });
});

describe('VB6Helpers: Randomize Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Randomize;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: Redim Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Redim;
    expect(actual).toBeDefined();
  });
  test('should Redim(value, 0, 4) to be 5', () => {
    let value = new Array(5);
    VB6Helpers.Redim(new Ref(() => value, val => value = val), 0, 4);
    expect(value.length).toEqual(5);
  });
  test('should Redim(value, 0, 4, 0, 9) to be 5, 10', () => {
    let value = new Array(5);
    VB6Helpers.Redim(new Ref(() => value, val => value = val), 0, 4, 0, 9);
    expect(value.length).toEqual(5);
    expect(value[0].length).toEqual(10);
  });
  test('should Redim(value, 0, 4, 0, 9, 0, 19) to be 5, 10, 20', () => {
    let value = new Array(5);
    VB6Helpers.Redim(new Ref(() => value, val => value = val), 0, 4, 0, 9, 0, 19);
    expect(value.length).toEqual(5);
    expect(value[0].length).toEqual(10);
    expect(value[0][0].length).toEqual(20);
  });
  test('should Redim(undefined, 0, 4) to be 5', () => {
    let value = undefined;
    VB6Helpers.Redim(new Ref(() => value, val => value = val), 0, 4);
    expect(value.length).toEqual(5);
  });
  test('should Redim(null, 0, 4) to be 5', () => {
    let value = null;
    VB6Helpers.Redim(new Ref(() => value, val => value = val), 0, 4);
    expect(value.length).toEqual(5);
  });
  test('should throw error when parameter are Redim(value, 0, 3)', () => {
    let value = new Array(5).fill('first');
    const actual = VB6Helpers.Redim.bind(undefined, new Ref(() => value, val => value = val));
    expect(actual).toThrow(InvalidProcedureCallOrArgumentError);
  });
});

describe('VB6Helpers: RedimPreserve Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.RedimPreserve;
    expect(actual).toBeDefined();
  });
  test('should RedimPreserve(value, 0, 4, 0, 9) to be 5, 10', () => {
    let value = new Array(5).fill('first').map(() => new Array(5).fill('second'));
    VB6Helpers.RedimPreserve(new Ref(() => value, val => value = val), 0, 4, 0, 9);
    expect(value.length).toEqual(5);
    expect(value[0].length).toEqual(10);
    expect(value[0][4]).toEqual('second');
    expect(value[0][5]).toEqual(undefined);
  });
  test('should RedimPreserve(value, 0, 4, 0, 2) to be 5, 3', () => {
    let value = new Array(5).fill('first').map(() => new Array(5).fill('second'));
    VB6Helpers.RedimPreserve(new Ref(() => value, val => value = val), 0, 4, 0, 2);
    expect(value.length).toEqual(5);
    expect(value[0].length).toEqual(3);
    expect(value[0][2]).toEqual('second');
  });
  test('should RedimPreserve(value, 0, 4, 0, 2) to be 5, 3', () => {
    let value = new Array(5).fill('first').map(() => new Array(5).fill('second'));
    VB6Helpers.RedimPreserve(new Ref(() => value, val => value = val), 0, 4, 0, 2);
    expect(value.length).toEqual(5);
    expect(value[0].length).toEqual(3);
    expect(value[0][2]).toEqual('second');
  });
  test('should throw error when parameter are RedimPreserve(value, 0, 3, 0, 9)', () => {
    let value = new Array(5).fill('first').map(() => new Array(5).fill('second'));
    const actual = VB6Helpers.RedimPreserve.bind(undefined, new Ref(() => value, val => value = val), 0, 3, 0, 9);
    expect(actual).toThrow(InvalidProcedureCallOrArgumentError);
  });
  test('should throw error when parameter are RedimPreserve(undefined, 0, 3)', () => {
    let value = undefined;
    const actual = VB6Helpers.RedimPreserve.bind(undefined, new Ref(() => value, val => value = val), 0, 3);
    expect(actual).toThrow(InvalidProcedureCallOrArgumentError);
  });
  test('should throw error when parameter are RedimPreserve(null, 0, 3)', () => {
    let value = null;
    const actual = VB6Helpers.RedimPreserve.bind(undefined, new Ref(() => value, val => value = val), 0, 3);
    expect(actual).toThrow(InvalidProcedureCallOrArgumentError);
  });
  test('should throw error when parameter are RedimPreserve(value, 0, 3)', () => {
    let value = new Array(5).fill('first');
    const actual = VB6Helpers.RedimPreserve.bind(undefined, new Ref(() => value, val => value = val));
    expect(actual).toThrow(InvalidProcedureCallOrArgumentError);
  });
});

describe('VB6Helpers: Replace Suite', () => {
  const string = 'Chennaiiq';
  test('should be defined', () => {
    const actual = VB6Helpers.Replace;
    expect(actual).toBeDefined();
  });
  test('should Replace("Chennaiiq", "n", "m") to be "Chemmaiiq"', () => {
    const actual = VB6Helpers.Replace(string, 'n', 'm');
    const expected = 'Chemmaiiq';
    expect(actual).toEqual(expected);
  });
  test('should Replace("Chennaiiq", "N", "m") to be "Chennaiiq"', () => {
    const actual = VB6Helpers.Replace(string, 'N', 'm');
    const expected = 'Chennaiiq';
    expect(actual).toEqual(expected);
  });
  test('should Replace("Chennaiiq", "n", "M") to be "CheMMaiiq"', () => {
    const actual = VB6Helpers.Replace(string, 'n', 'M');
    const expected = 'CheMMaiiq';
    expect(actual).toEqual(expected);
  });
  test('should Replace("Chennaiiq", "n", "m", 5) to be "maiiq"', () => {
    const actual = VB6Helpers.Replace(string, 'n', 'm', 5);
    const expected = 'maiiq';
    expect(actual).toEqual(expected);
  });
  test('should Replace("Chennaiiq", "n", "m", 4, 1) to be "mnaiiq"', () => {
    const actual = VB6Helpers.Replace(string, 'n', 'm', 4, 1);
    const expected = 'mnaiiq';
    expect(actual).toEqual(expected);
  });
  test('should Replace("", "n", "m") to be ""', () => {
    const actual = VB6Helpers.Replace('', 'n', 'm');
    const expected = '';
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter are Replace(null, "n", "m")', () => {
    const actual = VB6Helpers.Replace.bind(undefined, null, 'n', 'm');
    const expected = InvalidUseOfNullError;
    expect(actual).toThrow(expected);
  });
  test('should Replace("Chennaiiq", "", "m") to be "Chennaiiq"', () => {
    const actual = VB6Helpers.Replace(string, '', 'm');
    const expected = 'Chennaiiq';
    expect(actual).toEqual(expected);
  });
  test('should Replace("Chennaiiq", "n", "") to be "Cheaiiq"', () => {
    const actual = VB6Helpers.Replace(string, 'n', '');
    const expected = 'Cheaiiq';
    expect(actual).toEqual(expected);
  });
  test('should Replace("Chennaiiq", "n", "m", 20) to be ""', () => {
    const actual = VB6Helpers.Replace(string, 'n', 'm', 20);
    const expected = '';
    expect(actual).toEqual(expected);
  });
  test('should Replace("Chennaiiq", "n", "m", 1, 0) to be "Chennaiiq"', () => {
    const actual = VB6Helpers.Replace(string, 'n', 'm', 1, 0);
    const expected = 'Chennaiiq';
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: Right Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Right;
    expect(actual).toBeDefined();
  });
  test('should Right("abcd", 2) to be "cd"', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Right(value, 2);
    const expected = 'cd';
    expect(actual).toEqual(expected);
  });
  test('should Right("abcd", 0) to be ""', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Right(value, 0);
    const expected = '';
    expect(actual).toEqual(expected);
  });
  test('should Right("abcd", 5) to be "abcd"', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Right(value, 5);
    const expected = 'abcd';
    expect(actual).toEqual(expected);
  });
  test('should Right("abcd", 4) to be "abcd"', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Right(value, 4);
    const expected = 'abcd';
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter are Right("abcd", -1)', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Right.bind(undefined, value, -1);
    const expected = InvalidProcedureCallOrArgumentError
    expect(actual).toThrow(expected);
  });
  test('should throw error when parameter are Right("abcd", null)', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Right.bind(undefined, value, null);
    const expected = InvalidUseOfNullError
    expect(actual).toThrow(expected);
  });
  test('should Right(null, 2) to be null', () => {
    const value = null;
    const actual = VB6Helpers.Right(value, 2);
    const expected = null;
    expect(actual).toEqual(expected);
  });
  test('should Right("True", 3) to be "rue"', () => {
    const value = 'True';
    const actual = VB6Helpers.Right(value, 3);
    const expected = 'rue';
    expect(actual).toEqual(expected);
  });
  test('should Right("False", 3) to be "lse"', () => {
    const value = 'False';
    const actual = VB6Helpers.Right(value, 3);
    const expected = 'lse';
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter are Right("abcd", true)', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Right.bind(undefined, value, true);
    const expected = InvalidProcedureCallOrArgumentError
    expect(actual).toThrow(expected);
  });
  test('should Right("abcd", false) to be ""', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Right(value, false);
    const expected = '';
    expect(actual).toEqual(expected);
  });
  test('should Right(undefined, 3) to be ""', () => {
    const value = undefined;
    const actual = VB6Helpers.Right(value, 3);
    const expected = '';
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: Rnd Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Rnd;
    expect(actual).toBeDefined();
  });
  test('should Rnd() to be less than or equal 1 and greater than or equal 0', () => {
    const actual = VB6Helpers.Rnd();
    const zero = 0;
    const one = 1;
    expect(actual).toBeLessThanOrEqual(one);
    expect(actual).toBeGreaterThanOrEqual(zero);
  });
});

describe('VB6Helpers: Round Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Round;
    expect(actual).toBeDefined();
  });
  test('should Round(1) to be 1', () => {
    const value = 1;
    const actual = VB6Helpers.Round(value);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  test('should Round(1.5) to be 2', () => {
    const value = 1.5;
    const actual = VB6Helpers.Round(value);
    const expected = 2;
    expect(actual).toEqual(expected);
  });
  test('should Round(2.5) to be 2', () => {
    const value = 2.5;
    const actual = VB6Helpers.Round(value);
    const expected = 2;
    expect(actual).toEqual(expected);
  });
  test('should Round(0.0035, 3) to be 0.004', () => {
    const value = 0.0035;
    const actual = VB6Helpers.Round(value, 3);
    const expected = 0.004;
    expect(actual).toEqual(expected);
  });
  test('should Round(0.0045, 3) to be 0.004', () => {
    const value = 0.0045;
    const actual = VB6Helpers.Round(value, 3);
    const expected = 0.004;
    expect(actual).toEqual(expected);
  });
  test('should Round(2.5, 1) to be 2.5', () => {
    const value = 2.5;
    const actual = VB6Helpers.Round(value, 1);
    const expected = 2.5;
    expect(actual).toEqual(expected);
  });
  test('should Round(1234.5678, 3) to be 1234.568', () => {
    const value = 1234.5678;
    const actual = VB6Helpers.Round(value, 3);
    const expected = 1234.568;
    expect(actual).toEqual(expected);
  });
  test('should Round(123.5678) to be 124', () => {
    const value = 123.5678;
    const actual = VB6Helpers.Round(value);
    const expected = 124;
    expect(actual).toEqual(expected);
  });
  test('should Round(123.4567) to be 123', () => {
    const value = 123.4567;
    const actual = VB6Helpers.Round(value);
    const expected = 123;
    expect(actual).toEqual(expected);
  });
  test('should Round("123.4567") to be 123', () => {
    const value = '123.4567';
    const actual = VB6Helpers.Round(value);
    const expected = 123;
    expect(actual).toEqual(expected);
  });
  test('should Round(undefined) to be 0', () => {
    const value = undefined;
    const actual = VB6Helpers.Round(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should Round(null) to be null', () => {
    const value = null;
    const actual = VB6Helpers.Round(value);
    const expected = null;
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter is Round("abcd")', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Round.bind(undefined, value);
    const expected = TypeMismatchError;
    expect(actual).toThrow(expected);
  });
  test('should Round(true) to be -1', () => {
    const value = true;
    const actual = VB6Helpers.Round(value);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  test('should Round(false) to be 0', () => {
    const value = false;
    const actual = VB6Helpers.Round(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: Set Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Set;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: SetError Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.SetError;
    expect(actual).toBeDefined();
  });
  test('should set error infos', () => {
    const expected = new Error('Foo Bar');
    VB6Helpers.SetError(expected);
    expect(VB6Helpers.LastException).toEqual(expected);
    expect(VB6Helpers.LastErrorNumber).toEqual(undefined);
    expect(VB6Helpers.LastErrorDescription).toEqual(expected.message);
  });
  test('should set a specific error', () => {
    const expected: IVB6Error = { Number: 123, Description: 'Bar Foo' };
    VB6Helpers.SetError(expected);
    expect(VB6Helpers.LastException).toEqual(expected);
    expect(VB6Helpers.LastErrorNumber).toEqual(expected.Number);
    expect(VB6Helpers.LastErrorDescription).toEqual(expected.Description);
  });
});

describe('VB6Helpers: Shell Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Shell;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: Sleep Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Sleep;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: Space Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Space;
    expect(actual).toBeDefined();
  });
  test('should Space(5) to be "     "', () => {
    const value = 5;
    const actual = VB6Helpers.Space(value);
    const expected = '     ';
    expect(actual).toEqual(expected);
  });
  test('should "A" + Space(10) + "B" to be "A          B"', () => {
    const value = 10;
    const actual = `A${VB6Helpers.Space(value)}B`;
    const expected = 'A          B';
    expect(actual).toEqual(expected);
  });
  test('should Space(undefined) to be ""', () => {
    const value = undefined;
    const actual = VB6Helpers.Space(value);
    const expected = '';
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter is Space(null)', () => {
    const value = null;
    const actual = VB6Helpers.Space.bind(undefined, value);
    const expected = InvalidUseOfNullError;
    expect(actual).toThrow(expected);
  });
});

describe('VB6Helpers: Split Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Split;
    expect(actual).toBeDefined();
  });
  test('should Space("one - two - three", " - ") to be ["one", "two", "three"]', () => {
    const value = 'one - two - three';
    const actual = VB6Helpers.Split(value, ' - ');
    const expected = ['one', 'two', 'three'];
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: Str Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Str;
    expect(actual).toBeDefined();
  });
  test('should Str(1) to be "1"', () => {
    const value = 1;
    const actual = VB6Helpers.Str(value);
    const expected = '1';
    expect(actual).toEqual(expected);
  });
  test('should Str(1.5) to be "1.5"', () => {
    const value = 1.5;
    const actual = VB6Helpers.Str(value);
    const expected = '1.5';
    expect(actual).toEqual(expected);
  });
  test('should Str(987654) to be "987654"', () => {
    const value = 987654;
    const actual = VB6Helpers.Str(value);
    const expected = '987654';
    expect(actual).toEqual(expected);
  });
  test('should Str(-987654) to be "-987654"', () => {
    const value = -987654;
    const actual = VB6Helpers.Str(value);
    const expected = '-987654';
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter is Str("abc")', () => {
    const value = 'abc';
    const actual = VB6Helpers.Str.bind(undefined, value);
    const expected = TypeMismatchError;
    expect(actual).toThrow(expected);
  });
  test('should Str(undefined) to be "0"', () => {
    const value = undefined;
    const actual = VB6Helpers.Str(value);
    const expected = '0';
    expect(actual).toEqual(expected);
  });
  test('should Str(null) to be null', () => {
    const value = null;
    const actual = VB6Helpers.Str(value);
    const expected = null;
    expect(actual).toEqual(expected);
  });
  test('should Str(true) to be "true"', () => {
    const value = true;
    const actual = VB6Helpers.Str(value);
    const expected = 'true';
    expect(actual).toEqual(expected);
  });
  test('should Str(false) to be "false"', () => {
    const value = false;
    const actual = VB6Helpers.Str(value);
    const expected = 'false';
    expect(actual).toEqual(expected);
  });
  test('should Str(5 > 10) to be "false"', () => {
    const value = 5 > 10;
    const actual = VB6Helpers.Str(value);
    const expected = 'false';
    expect(actual).toEqual(expected);
  });
  test('should Str(5 < 10) to be "true"', () => {
    const value = 5 < 10;
    const actual = VB6Helpers.Str(value);
    const expected = 'true';
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: StrComp Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.StrComp;
    expect(actual).toBeDefined();
  });
  test('should StrComp("Mountains of the Moon", "Mountains of the Moon") to be 0', () => {
    const actual = VB6Helpers.StrComp('Mountains of the Moon', 'Mountains of the Moon');
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should StrComp("Mountains of the Moon", "Red sails at sunset") to be -1', () => {
    const actual = VB6Helpers.StrComp('Mountains of the Moon', 'Red sails at sunset');
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  test('should StrComp("Mountains of the Moon", "mountains of the moon", 0) to be -1', () => {
    const actual = VB6Helpers.StrComp('Mountains of the Moon', 'mountains of the moon', 0);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  test('should StrComp("Mountains of the Moon", "mountains of the moon", 1) to be 0', () => {
    const actual = VB6Helpers.StrComp('Mountains of the Moon', 'mountains of the moon', 1);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should StrComp("RED", "red", 1) to be 0', () => {
    const actual = VB6Helpers.StrComp('RED', 'red', 1);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: StrConv Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.StrConv;
    expect(actual).toBeDefined();
  });
  test('should "HELLO WORLD" to be "hello world"', () => {
    const value = 'HELLO WORLD';
    const actual = VB6Helpers.StrConv(value, VbStrConv.LowerCase);
    const expected = 'hello world';
    expect(actual).toEqual(expected);
  });
  test('should "hello world" to be "HELLO WORLD"', () => {
    const value = 'hello world';
    const actual = VB6Helpers.StrConv(value, VbStrConv.UpperCase);
    const expected = 'HELLO WORLD';
    expect(actual).toEqual(expected);
  });
  test('should "hello wORLD" to be "Hello World"', () => {
    const value = 'hello wORLD';
    const actual = VB6Helpers.StrConv(value, VbStrConv.ProperCase);
    const expected = 'Hello World';
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter are value, VbStrConv.vbWide', () => {
    const value = 'hello wORLD';
    const actual = VB6Helpers.StrConv.bind(undefined, value, VbStrConv.Wide);
    const expected = NotSupportedError;
    expect(actual).toThrow(expected);
  });
  test('should throw error when parameter are value, VbStrConv.vbNarrow', () => {
    const value = 'hello wORLD';
    const actual = VB6Helpers.StrConv.bind(undefined, value, VbStrConv.Narrow);
    const expected = NotSupportedError;
    expect(actual).toThrow(expected);
  });
});

describe('VB6Helpers: String Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.String;
    expect(actual).toBeDefined();
  });
  test('should String(10, "-") to be "----------"', () => {
    const actual = VB6Helpers.String(10, '-');
    const expected = '----------';
    expect(actual).toEqual(expected);
  });
  test('should String(7, "A") to be "AAAAAAA"', () => {
    const actual = VB6Helpers.String(7, 'A');
    const expected = 'AAAAAAA';
    expect(actual).toEqual(expected);
  });
  test('should String(7, 65) to be "AAAAAAA"', () => {
    const actual = VB6Helpers.String(7, 65);
    const expected = 'AAAAAAA';
    expect(actual).toEqual(expected);
  });
  test('should String(7, 322) to be "BBBBBBB"', () => {
    const actual = VB6Helpers.String(7, 322);
    const expected = 'BBBBBBB';
    expect(actual).toEqual(expected);
  });
  test('should String(8, "Chennaiiq") to be "CCCCCCCC"', () => {
    const actual = VB6Helpers.String(8, 'Chennaiiq');
    const expected = 'CCCCCCCC';
    expect(actual).toEqual(expected);
  });
  test('should String(3, " ") to be "   "', () => {
    const actual = VB6Helpers.String(3, ' ');
    const expected = '   ';
    expect(actual).toEqual(expected);
  });
  test('should throw error when parameter are String(null, "A")', () => {
    const actual = VB6Helpers.String.bind(undefined, null, 'A');
    const expected = InvalidUseOfNullError;
    expect(actual).toThrow(expected);
  });
  test('should String(10, null) to be null', () => {
    const actual = VB6Helpers.String(10, null);
    const expected = null;
    expect(actual).toEqual(expected);
  });
  test('should String(5, undefined) to be "     "', () => {
    const actual = VB6Helpers.String(5, undefined);
    const expected = '     ';
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: StringToByteArray Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.StringToByteArray;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: ToOleColor Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.ToOleColor;
    expect(actual).toBeDefined();
  });
});

describe('VB6Helpers: Trim Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Trim;
    expect(actual).toBeDefined();
  });
  test('should Trim("   abcd   ") to be "abcd"', () => {
    const value = '   abcd   ';
    const actual = VB6Helpers.Trim(value);
    const expected = 'abcd';
    expect(actual).toEqual(expected);
  });
  test('should Trim("   Abcd   ") to be "Abcd"', () => {
    const value = '   Abcd   ';
    const actual = VB6Helpers.Trim(value);
    const expected = 'Abcd';
    expect(actual).toEqual(expected);
  });
  test('should Trim("ABCD   ") to be "ABCD"', () => {
    const value = 'ABCD   ';
    const actual = VB6Helpers.Trim(value);
    const expected = 'ABCD';
    expect(actual).toEqual(expected);
  });
  test('should Trim(1) to be "1"', () => {
    const value = 1;
    const actual = VB6Helpers.Trim(value);
    const expected = '1';
    expect(actual).toEqual(expected);
  });
  test('should Trim(true) to be "true"', () => {
    const value = true;
    const actual = VB6Helpers.Trim(value);
    const expected = 'true';
    expect(actual).toEqual(expected);
  });
  test('should Trim(false) to be "false"', () => {
    const value = false;
    const actual = VB6Helpers.Trim(value);
    const expected = 'false';
    expect(actual).toEqual(expected);
  });
  test('should Trim(null) to be ""', () => {
    const value = null;
    const actual = VB6Helpers.Trim(value);
    const expected = '';
    expect(actual).toEqual(expected);
  });
  test('should Trim(undefined) to be ""', () => {
    const value = undefined;
    const actual = VB6Helpers.Trim(value);
    const expected = '';
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: TypeName Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.TypeName;
    expect(actual).toBeDefined();
  });
  test('should TypeName(1) to be "Integer"', () => {
    const value = 1;
    const actual = VB6Helpers.TypeName(value);
    const expected = 'Integer';
    expect(actual).toEqual(expected);
  });
  test('should TypeName(-1) to be "Integer"', () => {
    const value = -1;
    const actual = VB6Helpers.TypeName(value);
    const expected = 'Integer';
    expect(actual).toEqual(expected);
  });
  test('should TypeName(5.050000190734863) to be "Single"', () => {
    const value = 5.050000190734863;
    const actual = VB6Helpers.TypeName(value);
    const expected = 'Single';
    expect(actual).toEqual(expected);
  });
  test('should TypeName(1.55) to be "Double"', () => {
    const value = 1.55;
    const actual = VB6Helpers.TypeName(value);
    const expected = 'Double';
    expect(actual).toEqual(expected);
  });
  test('should TypeName(BigInt(20)) to be "Long"', () => {
    const value: bigint = BigInt(20);
    const actual = VB6Helpers.TypeName(value);
    const expected = 'Long';
    expect(actual).toEqual(expected);
  });
  test('should TypeName("abc") to be "String"', () => {
    const value = 'abc';
    const actual = VB6Helpers.TypeName(value);
    const expected = 'String';
    expect(actual).toEqual(expected);
  });
  test('should TypeName(5 > 10) to be "Boolean"', () => {
    const value = 5 > 10;
    const actual = VB6Helpers.TypeName(value);
    const expected = 'Boolean';
    expect(actual).toEqual(expected);
  });
  test('should TypeName({}) to be "Object"', () => {
    const value = {};
    const actual = VB6Helpers.TypeName(value);
    const expected = 'Object';
    expect(actual).toEqual(expected);
  });
  test('should TypeName(undefined) to be "Empty"', () => {
    const value = undefined;
    const actual = VB6Helpers.TypeName(value);
    const expected = 'Empty';
    expect(actual).toEqual(expected);
  });
  test('should TypeName(new ArrayBuffer(2)) to be "Byte"', () => {
    const value: ArrayBuffer = new ArrayBuffer(2);
    const actual = VB6Helpers.TypeName(value);
    const expected = 'Byte';
    expect(actual).toEqual(expected);
  });
  test('should TypeName(new Date(2020, 9, 16)) to be "Date"', () => {
    const value: Date = new Date(2020, 8, 16);
    const actual = VB6Helpers.TypeName(value);
    const expected = 'Date';
    expect(actual).toEqual(expected);
  });
  test('should TypeName("2020/09/16") to be "Date"', () => {
    const value = '2020/09/16';
    const actual = VB6Helpers.TypeName(value);
    const expected = 'Date';
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: UBound Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.UBound;
    expect(actual).toBeDefined();
  });
  test('should "[[1, 2, 3], [4, 5, 6]]" to be 2', () => {
    const value = [[1, 2, 3], [4, 5, 6]];
    const actual = VB6Helpers.UBound(value);
    const expected = 2;
    expect(actual).toEqual(expected);
  });
  test('should "[[1, 2, 3], [4, 5, 6]]" to be 3', () => {
    const value = [[1, 2, 3], [4, 5, 6]];
    const actual = VB6Helpers.UBound(value, 2);
    const expected = 3;
    expect(actual).toEqual(expected);
  });
  test('should "[[1, 2, 3], [4, 5, 6]]" to be 3', () => {
    const value = [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]];
    const actual = VB6Helpers.UBound(value, 3);
    const expected = 4;
    expect(actual).toEqual(expected);
  });
  test('should throw error when "[[1, 2, 3], [4, 5, 6]]" with rank 3', () => {
    const value = [[1, 2, 3], [4, 5, 6]];
    const actual = VB6Helpers.UBound.bind(undefined, value, 3);
    const expected = IndexOutOfRangeError;
    expect(actual).toThrow(expected);
  });
});

describe('VB6Helpers: UCase Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.UCase;
    expect(actual).toBeDefined();
  });
  test('should "abcd" to be "ABCD"', () => {
    const value = 'abcd';
    const actual = VB6Helpers.UCase(value);
    const expected = 'ABCD';
    expect(actual).toEqual(expected);
  });
  test('should "Abcd" to be "ABCD"', () => {
    const value = 'Abcd';
    const actual = VB6Helpers.UCase(value);
    const expected = 'ABCD';
    expect(actual).toEqual(expected);
  });
  test('should "vb6.0" to be "VB6.0"', () => {
    const value = 'vb6.0';
    const actual = VB6Helpers.UCase(value);
    const expected = 'VB6.0';
    expect(actual).toEqual(expected);
  });
  test('should 1 to be "1"', () => {
    const value = 1;
    const actual = VB6Helpers.UCase(value);
    const expected = '1';
    expect(actual).toEqual(expected);
  });
  test('should true to be "TRUE"', () => {
    const value = true;
    const actual = VB6Helpers.UCase(value);
    const expected = 'TRUE';
    expect(actual).toEqual(expected);
  });
  test('should false to be "FALSE"', () => {
    const value = false;
    const actual = VB6Helpers.UCase(value);
    const expected = 'FALSE';
    expect(actual).toEqual(expected);
  });
  test('should null to be null', () => {
    const value = null;
    const actual = VB6Helpers.UCase(value);
    const expected = null;
    expect(actual).toEqual(expected);
  });
  test('should undefined to be ""', () => {
    const value = undefined;
    const actual = VB6Helpers.UCase(value);
    const expected = '';
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: Unload Suite', () => {
  const fixture: IActionShellComponent<{ stack: { path: string }[] }, { navigate: (...args: string[]) => void }> = {
    payload: {
      stack: []
    },
    command: (command: string, ...params: Array<any>) => {
      fixture.navigate('frmanagrafica');
    },
    navigate: (...args: string[]) => {
      const frame = {
        path: args[0]
      };
      fixture.payload.stack.push(frame);
    },
    router: {
      navigate: (...args: string[]) => {
        const frame = {
          path: args[0]
        };
        fixture.payload.stack = [frame];
      }
    },
    return: () => {
      fixture.payload.stack.pop();
    }
  };
  test('should be defined', () => {
    const actual = VB6Helpers.Unload;
    expect(actual).toBeDefined();
  });
  test('should step back into stack', () => {
    fixture.navigate('frmcerper');
    fixture.navigate('frmpersona');
    expect(fixture.payload.stack.length).toEqual(2);
    VB6Helpers.Unload(fixture);
    expect(fixture.payload.stack.length).toEqual(1);
  });
  test('should unload component', () => {
    VB6Helpers.Unload(fixture);
    expect(fixture.payload.stack.length).toEqual(1);
    expect(fixture.payload.stack[0].path).toEqual(['/']);
  });
  test('should unload component executing a command', () => {
    fixture.navigate('frmistruttoria');
    expect(fixture.payload.stack.length).toEqual(2);
    VB6Helpers.Unload(fixture, 'sampleCommand');
    expect(fixture.payload.stack.length).toEqual(3);
  });
});

describe('VB6Helpers: Val Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Val;
    expect(actual).toBeDefined();
  });
  test('should "1" to be 1', () => {
    const value = '1';
    const actual = VB6Helpers.Val(value);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  test('should "1.5" to be 1.5', () => {
    const value = '1.5';
    const actual = VB6Helpers.Val(value);
    const expected = 1.5;
    expect(actual).toEqual(expected);
  });
  test('should "987654" to be 987654', () => {
    const value = '987654';
    const actual = VB6Helpers.Val(value);
    const expected = 987654;
    expect(actual).toEqual(expected);
  });
  test('should "   1 2 3 " to be 123', () => {
    const value = '   1 2 3 ';
    const actual = VB6Helpers.Val(value);
    const expected = 123;
    expect(actual).toEqual(expected);
  });
  test('should "a123" to be 0', () => {
    const value = 'a123';
    const actual = VB6Helpers.Val(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should "123a456" to be 123', () => {
    const value = '123a456';
    const actual = VB6Helpers.Val(value);
    const expected = 123;
    expect(actual).toEqual(expected);
  });
  test('should "123,456" to be 123', () => {
    const value = '123,456';
    const actual = VB6Helpers.Val(value);
    const expected = 123;
    expect(actual).toEqual(expected);
  });
  test('should 5 > 10 to be 0', () => {
    const value = 5 > 10;
    const actual = VB6Helpers.Val(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should 5 < 10 to be -1', () => {
    const value = 5 < 10;
    const actual = VB6Helpers.Val(value);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  test('should "&HFF" to be 255', () => {
    const value = '&HFF';
    const actual = VB6Helpers.Val(value);
    const expected = 255;
    expect(actual).toEqual(expected);
  });
  test('should "&O10" to be 8', () => {
    const value = '&O10';
    const actual = VB6Helpers.Val(value);
    const expected = 8;
    expect(actual).toEqual(expected);
  });
  test('should null to be 0', () => {
    const value = null;
    const actual = VB6Helpers.Val(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  test('should "abcd" to be 0', () => {
    const value = 'abcd';
    const actual = VB6Helpers.Val(value);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
});

describe('VB6Helpers: Year Suite', () => {
  test('should be defined', () => {
    const actual = VB6Helpers.Year;
    expect(actual).toBeDefined();
  });
  test('should "2020/09/16" to be "2020"', () => {
    const value = new Date(2020, 8, 16);
    const actual = VB6Helpers.Year(value);
    const expected = 2020;
    expect(actual).toEqual(expected);
  });
  test('should DateAdd("q", 1, "2020/09/16") to be "2020"', () => {
    const value = new Date(2020, 8, 16);
    VB6Helpers.DateAdd(DateInterval.Quarter, 1, value);
    const actual = VB6Helpers.Year(value);
    const expected = 2020;
    expect(actual).toEqual(expected);
  });
  test('should undefined to be undefined', () => {
    const value = undefined;
    const actual = VB6Helpers.Year(value);
    const expected = undefined;
    expect(actual).toEqual(expected);
  });
  test('should null to be null', () => {
    const value = null;
    const actual = VB6Helpers.Year(value);
    const expected = null;
    expect(actual).toEqual(expected);
  });
});