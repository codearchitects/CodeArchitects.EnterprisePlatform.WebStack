import {DateTimeOffset} from './date-time-offset';

describe('DateTimeOffset', () => {

  let dateTimeOffset: DateTimeOffset;

  beforeEach(() => {
    // Arrange
    dateTimeOffset = new DateTimeOffset(new Date('2022-01-01T12:00:00'), -300);
  });

  it('should be defined', () => {
    // Assert
    expect(DateTimeOffset).toBeDefined();
    expect(dateTimeOffset).toBeDefined();
    expect(dateTimeOffset instanceof DateTimeOffset).toBe(true);
  });

  it('should create DateTimeOffset object from ISO 8601 string', () => {
    // Act
    const isoString = '2022-01-01T12:00:00-05:00';
    const result = DateTimeOffset.fromISO8601String(isoString);

    // Assert
    expect(result).toEqual(dateTimeOffset);
  });

  it('should convert DateTimeOffset object to ISO 8601 string', () => {
    // Act
    const result = dateTimeOffset.toISO8601String();

    // Assert
    expect(result).toEqual('2022-01-01T12:00:00.0-05:00');
  });

});