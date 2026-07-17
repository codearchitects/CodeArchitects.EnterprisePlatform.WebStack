import { DateTime } from './date-time';
import { expect } from 'chai';

describe('DataRange', () => {

  let dateTime: DateTime;
  let dateTimeUndefined: DateTime;

  beforeEach(() => {
    // Arrange
    dateTime = new DateTime('2016-01-01 20:30');
    dateTimeUndefined = new DateTime(undefined);
  });

  it('should be defined', () => {
    // Assert
    expect(DateTime).to.exist;
    expect(dateTime).to.exist;
    expect(dateTime instanceof DateTime).to.be.true;
  });

  it('should return date part', () => {
    // Assert
    expect(dateTime.date.getFullYear()).to.equal(2016);
    expect(dateTime.date.getMonth()).to.equal(0);
    expect(dateTime.date.getDate()).to.equal(1);
  });

  it('should return time part', () => {
    // Assert
    expect(dateTime.time.getHours()).to.equal(20);
    expect(dateTime.time.getMinutes()).to.equal(30);
  });

  it('should return the stored time value', () => {
    // Assert
    expect(dateTime.valueOf()).to.equal(1451676600000);
  });

  it('should return a string representation', () => {
    // Assert
    expect(dateTime.toISOString()).to.equal('2016-01-01T19:30:00.000Z');
  });

  it('should return a js date representation', () => {
    // Assert
    expect(dateTime.toDate()).to.deep.equal(new Date(2016, 0, 1, 20, 30));
  });

  it('toISOString should return undefined when dateTime value is undefined', () => {
    // Assert
    expect(dateTimeUndefined.toDate() === undefined);
    expect(dateTimeUndefined !== undefined);
    expect(dateTimeUndefined.toISOString() === undefined);
  });
});
