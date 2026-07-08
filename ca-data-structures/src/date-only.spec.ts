import { DateOnly, toDateOnly } from './date-only';

describe('toDateOnly', () => {
  it('should return null if input date is invalid', () => {
    // Arrange
    const invalidDate = null;

    // Act
    const result = toDateOnly(invalidDate!);

    // Assert
    expect(result).toBeNull();
  });

  it('should return the start of the day as DateOnly', () => {
    // Arrange
    const inputDate = new Date('2022-01-01T12:34:56');

    // Act
    const result = toDateOnly(inputDate);

    // Assert
    expect(result).toEqual(new DateOnly('2022-01-01'));
  });

});