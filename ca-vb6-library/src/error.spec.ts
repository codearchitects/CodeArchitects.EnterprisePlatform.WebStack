import { VB6Error as Error } from './index';

describe('VB6Error Suite', () => {
  test('should be defined', () => {
    const actual = Error;
    expect(actual).toBeDefined();
  });

  test('should Clear method defined', () => {
    const actual = Error.Clear;
    expect(actual).toBeDefined();
  });

  test('should Raise method defined', () => {
    const actual = Error.Raise;
    expect(actual).toBeDefined();
  });

  test('should Number property not defined', () => {
    const actual = Error.Number;
    expect(actual).toBeUndefined();
  });

  test('should raise an error', () => {
    jest.spyOn(console, 'error');
    Error.Raise(23, undefined, 'Sample error');
    expect(console.error).toHaveBeenCalledWith(`Error 23: Sample error`);
    const actual = Error.Number;
    expect(actual).toEqual(23);
  });

  test('should clear error', () => {
    Error.Clear();
    const actual = Error.Number;
    expect(actual).toBeUndefined();
  });
});