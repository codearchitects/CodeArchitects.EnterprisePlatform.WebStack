import {DateRange} from './date-range';
import {expect} from 'chai';

describe('DataRange', () => {

  let dateRange: DateRange;

  beforeEach(() => {
    // Arrange
    dateRange = new DateRange(new Date('2016-01-01'), new Date('2016-01-30'));
  });

  it('should be defined', () => {
    // Assert
    expect(DateRange).to.exist;
    expect(dateRange).to.exist;
    expect(dateRange instanceof DateRange).to.be.true;
  });

  it('should return start date', () => {
    // Assert
    expect(dateRange.start).to.deep.equal(new Date('2016-01-01'));
  });

  it('should return end date', () => {
    // Assert
    expect(dateRange.end).to.deep.equal(new Date('2016-01-30'));
  });

});
