import { DateTime } from './date-time';

describe('DateTime', () => {
  let dateTime: DateTime;
  let dateTimeUndefined: DateTime;

  beforeEach(() => {
    dateTime = new DateTime('2016-01-01 20:30');
    dateTimeUndefined = new DateTime();
  });

  it('should be defined', () => {
    expect(DateTime).toBeDefined();
    expect(dateTime).toBeDefined();
    expect(dateTime instanceof DateTime).toBe(true);
  });

  it('should return date part', () => {
    expect(dateTime.date.getFullYear()).toBe(2016);
    expect(dateTime.date.getMonth()).toBe(0);
    expect(dateTime.date.getDate()).toBe(1);
  });

  it('should return time part', () => {
    expect(dateTime.time.getHours()).toBe(20);
    expect(dateTime.time.getMinutes()).toBe(30);
  });

  it('should return the stored time value', () => {
    expect(dateTime.valueOf()).toBe(1451676600000);
  });

  it('should return a string representation', () => {
    expect(dateTime.toISOString()).toBe('2016-01-01T19:30:00.000Z');
  });

  it('should return a js date representation', () => {
    expect(dateTime.toDate()).toEqual(new Date(2016, 0, 1, 20, 30));
  });

  it('toISOString should return undefined when dateTime value is undefined', () => {
    expect(dateTimeUndefined.toDate()).toBeUndefined();
    expect(dateTimeUndefined).toBeDefined();
    expect(dateTimeUndefined.toISOString()).toBeUndefined();
  });
});
