import { DateRange } from './date-range';

describe('DateRange', () => {

  let dateRange: DateRange;

  beforeEach(() => {
    // Arrange
    dateRange = new DateRange(new Date('2016-01-01'), new Date('2016-01-30'));
  });

  it('should be defined', () => {
    // Assert
    expect(DateRange).toBeDefined();
    expect(dateRange).toBeDefined();
    expect(dateRange).toBeInstanceOf(DateRange);
  });

  it('should return start date', () => {
    // Assert
    expect(dateRange.start).toEqual(new Date('2016-01-01'));
  });

  it('should return end date', () => {
    // Assert
    expect(dateRange.end).toEqual(new Date('2016-01-30'));
  });

});
