import {TimeSpan} from './time-span';
import {expect} from 'chai';

describe('TimeSpan', () => {

  it('should be defined', () => {
    // Arrange
    let timeSpan = new TimeSpan();

    // Assert
    expect(TimeSpan).to.exist;
    expect(timeSpan).to.exist;
    expect(timeSpan instanceof TimeSpan).to.be.true;
  });

  it('should return min value', () => {
    // Assert
    verifyTimeSpan(TimeSpan.MinValue, -10424, -23, -58, -45, -474);
  });

  it('should return max value', () => {
    // Assert
    verifyTimeSpan(TimeSpan.MaxValue, 10424, 23, 58, 45, 474);
  });

  it('should return zero value', () => {
    // Assert
    verifyTimeSpan(TimeSpan.Zero, 0, 0, 0, 0, 0);
  });

  it('should permit empty construct', () => {
    // Arrange
    let timeSpan = new TimeSpan();

    // Assert
    verifyTimeSpan(timeSpan, 0, 0, 0, 0, 0);
  });

  it('should normalize positive long constructor', () => {
    // Arrange
    let timeSpan = newTimeSpan1(999999999999999999);

    // Assert
    verifyTimeSpan(timeSpan, 10424, 23, 58, 45, 474);
  });

  it('should normalize negative long constructor', () => {
    // Arrange
    let timeSpan = newTimeSpan1(-999999999999999999);

    // Assert
    verifyTimeSpan(timeSpan, -10424, -23, -58, -45, -474);
  });

  it('should permit hours_minutes_seconds construct', () => {
    // Arrange
    let timeSpan = newTimeSpan3(10, 9, 8);

    // Assert
    verifyTimeSpan(timeSpan, 0, 10, 9, 8, 0);
  });

  it('should throw argument out of range error if call hours_minutes_seconds construct with invalid params', () => {
    // Assert
    expect(() => newTimeSpan3(Math.floor(TimeSpan.MinValue.totalHours) - 1, 0, 0)).to.throw('Argument out of range');
    expect(() => newTimeSpan3(Math.ceil(TimeSpan.MaxValue.totalHours) + 1, 0, 0)).to.throw('Argument out of range');
  });

  it('should permit days_hours_minutes_seconds_milliseconds construct', () => {
    // Arrange
    let timeSpan = newTimeSpan5(10, 9, 8, 7, 6);

    // Assert
    verifyTimeSpan(timeSpan, 10, 9, 8, 7, 6);
  });

  it('should throw argument out of range error if call hours_minutes_seconds_milliseconds construct with invalid params', () => {
    // Arrange
    let min = TimeSpan.MinValue;
    let max = TimeSpan.MaxValue;

    // Assert
    expect(() => newTimeSpan5(min.days - 1, min.hours, min.minutes, min.seconds, min.milliseconds)).to.throw('Argument out of range');
    expect(() => newTimeSpan5(min.days, min.hours - 1, min.minutes, min.seconds, min.milliseconds)).to.throw('Argument out of range');
    expect(() => newTimeSpan5(min.days, min.hours, min.minutes - 1, min.seconds, min.milliseconds)).to.throw('Argument out of range');
    expect(() => newTimeSpan5(min.days, min.hours, min.minutes, min.seconds - 1, min.milliseconds)).to.throw('Argument out of range');
    expect(() => newTimeSpan5(min.days, min.hours, min.minutes, min.seconds, min.milliseconds - 1)).to.throw('Argument out of range');

    expect(() => newTimeSpan5(max.days + 1, max.hours, max.minutes, max.seconds, max.milliseconds)).to.throw('Argument out of range');
    expect(() => newTimeSpan5(max.days, max.hours + 1, max.minutes, max.seconds, max.milliseconds)).to.throw('Argument out of range');
    expect(() => newTimeSpan5(max.days, max.hours, max.minutes + 1, max.seconds, max.milliseconds)).to.throw('Argument out of range');
    expect(() => newTimeSpan5(max.days, max.hours, max.minutes, max.seconds + 1, max.milliseconds)).to.throw('Argument out of range');
    expect(() => newTimeSpan5(max.days, max.hours, max.minutes, max.seconds, max.milliseconds + 1)).to.throw('Argument out of range');
  });

  it('should return totals', () => {
    // Arrange
    let data = [
      { actual: newTimeSpan5(0, 0, 0, 0, 0), expected: getTimeSpanParams(0.0, 0.0, 0.0, 0.0, 0.0) },
      { actual: newTimeSpan5(0, 0, 0, 0, 500), expected: getTimeSpanParams(0.5 / 60.0 / 60.0 / 24.0, 0.5 / 60.0 / 60.0, 0.5 / 60.0, 0.5, 500.0) },
      { actual: newTimeSpan5(0, 1, 0, 0, 0), expected: getTimeSpanParams(1 / 24.0, 1, 60, 3600, 3600000) },
      { actual: newTimeSpan5(1, 0, 0, 0, 0), expected: getTimeSpanParams(1, 24, 1440, 86400, 86400000) },
      { actual: newTimeSpan5(1, 1, 0, 0, 0), expected: getTimeSpanParams(25.0 / 24.0, 25, 1500, 90000, 90000000) }
    ];

    // Assert
    data.forEach(({actual, expected}) => {
      expect(expected.days).to.equal(actual.totalDays);
      expect(expected.hours).to.equal(actual.totalHours);
      expect(expected.minutes).to.equal(actual.totalMinutes);
      expect(expected.seconds).to.equal(actual.totalSeconds);
      expect(expected.milliseconds).to.equal(actual.totalMilliseconds);
    });
  });

  it('should permit additions', () => {
    // Arrange
    let data = [
      { actual1: newTimeSpan3(0, 0, 0), actual2: newTimeSpan3(1, 2, 3), expected: newTimeSpan3(1, 2, 3) },
      { actual1: newTimeSpan3(1, 2, 3), actual2: newTimeSpan3(4, 5, 6), expected: newTimeSpan3(5, 7, 9) },
      { actual1: newTimeSpan3(1, 2, 3), actual2: newTimeSpan3(-4, -5, -6), expected: newTimeSpan3(-3, -3, -3) },

      { actual1: newTimeSpan5(1, 2, 3, 4, 5), actual2: newTimeSpan3(1, 2, 3), expected: newTimeSpan5(1, 3, 5, 7, 5) },
      { actual1: newTimeSpan5(1, 2, 3, 4, 5), actual2: newTimeSpan5(10, 12, 13, 14, 15), expected: newTimeSpan5(11, 14, 16, 18, 20) },

      { actual1: newTimeSpan1(10000), actual2: newTimeSpan1(200000), expected: newTimeSpan1(210000) }
    ];

    // Assert
    data.forEach(({actual1, actual2, expected}) => {
      expect(actual1.add(actual2)).to.deep.equal(expected);
    });
  });

  it('should throw overflow error if total is beyond limits', () => {
    // Assert
    expect(() => TimeSpan.MinValue.add(newTimeSpan1(-1))).to.throw('Overflow error');
    expect(() => TimeSpan.MaxValue.add(newTimeSpan1(1))).to.throw('Overflow error');
  });

  it('should permit comparations', () => {
    // Arrange
    let data = [
      { actual1: newTimeSpan1(10000), actual2: newTimeSpan1(10000), expected: 0 },
      { actual1: newTimeSpan1(20000), actual2: newTimeSpan1(10000), expected: 1 },
      { actual1: newTimeSpan1(10000), actual2: newTimeSpan1(20000), expected: -1 },

      { actual1: newTimeSpan3(1, 2, 3), actual2: newTimeSpan3(1, 2, 3), expected: 0 },
      { actual1: newTimeSpan3(1, 2, 3), actual2: newTimeSpan3(1, 2, 4), expected: -1 },
      { actual1: newTimeSpan3(1, 2, 3), actual2: newTimeSpan3(1, 2, 2), expected: 1 },
      { actual1: newTimeSpan3(1, 2, 3), actual2: newTimeSpan3(1, 3, 3), expected: -1 },
      { actual1: newTimeSpan3(1, 2, 3), actual2: newTimeSpan3(1, 1, 3), expected: 1 },
      { actual1: newTimeSpan3(1, 2, 3), actual2: newTimeSpan3(2, 2, 3), expected: -1 },
      { actual1: newTimeSpan3(1, 2, 3), actual2: newTimeSpan3(0, 2, 3), expected: 1 },

      { actual1: newTimeSpan4(1, 2, 3, 4), actual2: newTimeSpan4(1, 2, 3, 4), expected: 0 },
      { actual1: newTimeSpan4(1, 2, 3, 4), actual2: newTimeSpan4(1, 2, 3, 5), expected: -1 },
      { actual1: newTimeSpan4(1, 2, 3, 4), actual2: newTimeSpan4(1, 2, 3, 3), expected: 1 },
      { actual1: newTimeSpan4(1, 2, 3, 4), actual2: newTimeSpan4(1, 2, 4, 4), expected: -1 },
      { actual1: newTimeSpan4(1, 2, 3, 4), actual2: newTimeSpan4(1, 2, 2, 4), expected: 1 },
      { actual1: newTimeSpan4(1, 2, 3, 4), actual2: newTimeSpan4(1, 3, 3, 4), expected: -1 },
      { actual1: newTimeSpan4(1, 2, 3, 4), actual2: newTimeSpan4(1, 1, 3, 4), expected: 1 },
      { actual1: newTimeSpan4(1, 2, 3, 4), actual2: newTimeSpan4(2, 2, 3, 4), expected: -1 },
      { actual1: newTimeSpan4(1, 2, 3, 4), actual2: newTimeSpan4(0, 2, 3, 4), expected: 1 },

      { actual1: newTimeSpan5(1, 2, 3, 4, 5), actual2: newTimeSpan5(1, 2, 3, 4, 5), expected: 0 },
      { actual1: newTimeSpan5(1, 2, 3, 4, 5), actual2: newTimeSpan5(1, 2, 3, 4, 6), expected: -1 },
      { actual1: newTimeSpan5(1, 2, 3, 4, 5), actual2: newTimeSpan5(1, 2, 3, 4, 4), expected: 1 },
      { actual1: newTimeSpan5(1, 2, 3, 4, 5), actual2: newTimeSpan5(1, 2, 3, 5, 5), expected: -1 },
      { actual1: newTimeSpan5(1, 2, 3, 4, 5), actual2: newTimeSpan5(1, 2, 3, 3, 5), expected: 1 },
      { actual1: newTimeSpan5(1, 2, 3, 4, 5), actual2: newTimeSpan5(1, 2, 4, 4, 5), expected: -1 },
      { actual1: newTimeSpan5(1, 2, 3, 4, 5), actual2: newTimeSpan5(1, 2, 2, 4, 5), expected: 1 },
      { actual1: newTimeSpan5(1, 2, 3, 4, 5), actual2: newTimeSpan5(1, 3, 3, 4, 5), expected: -1 },
      { actual1: newTimeSpan5(1, 2, 3, 4, 5), actual2: newTimeSpan5(1, 1, 3, 4, 5), expected: 1 },
      { actual1: newTimeSpan5(1, 2, 3, 4, 5), actual2: newTimeSpan5(2, 2, 3, 4, 5), expected: -1 },
      { actual1: newTimeSpan5(1, 2, 3, 4, 5), actual2: newTimeSpan5(0, 2, 3, 4, 5), expected: 1 },

      { actual1: newTimeSpan1(10000), actual2: null, expected: 1 }
    ];

    // Assert
    data.forEach(({actual1, actual2, expected}) => {
      expect(actual1.compareTo(actual2)).to.equal(expected);
    });
  });

  it('should calculate duration', () => {
    // Arrange
    let data = [
      { actual: newTimeSpan3(0, 0, 0), expected: newTimeSpan3(0, 0, 0) },
      { actual: newTimeSpan3(1, 2, 3), expected: newTimeSpan3(1, 2, 3) },
      { actual: newTimeSpan3(-1, -2, -3), expected: newTimeSpan3(1, 2, 3) },

      { actual: newTimeSpan1(12345), expected: newTimeSpan1(12345) },
      { actual: newTimeSpan1(-12345), expected: newTimeSpan1(12345) }
    ];

    // Assert
    data.forEach(({actual, expected}) => {
      expect(actual.duration()).to.deep.equal(expected);
    });
  });

  it('should permit equivalence', () => {
    // Arrange
    let data = [
      { actual1: newTimeSpan3(0, 0, 0), actual2: newTimeSpan3(0, 0, 0), expected: true },
      { actual1: newTimeSpan3(1, 2, 3), actual2: newTimeSpan3(1, 2, 3), expected: true },
      { actual1: newTimeSpan3(1, 2, 3), actual2: newTimeSpan3(1, 2, 4), expected: false },
      { actual1: newTimeSpan3(1, 2, 3), actual2: newTimeSpan3(1, 3, 3), expected: false },
      { actual1: newTimeSpan3(1, 2, 3), actual2: newTimeSpan3(2, 2, 3), expected: false },
      { actual1: newTimeSpan3(1, 2, 3), actual2: newTimeSpan4(0, 1, 2, 3), expected: true },
      { actual1: newTimeSpan3(1, 2, 3), actual2: newTimeSpan5(0, 1, 2, 3, 0), expected: true },

      { actual1: newTimeSpan4(1, 2, 3, 4), actual2: newTimeSpan4(1, 2, 3, 4), expected: true },
      { actual1: newTimeSpan4(1, 2, 3, 4), actual2: newTimeSpan4(1, 2, 3, 5), expected: false },
      { actual1: newTimeSpan4(1, 2, 3, 4), actual2: newTimeSpan4(1, 2, 4, 4), expected: false },
      { actual1: newTimeSpan4(1, 2, 3, 4), actual2: newTimeSpan4(1, 3, 3, 4), expected: false },
      { actual1: newTimeSpan4(1, 2, 3, 4), actual2: newTimeSpan4(2, 2, 3, 4), expected: false },

      { actual1: newTimeSpan5(1, 2, 3, 4, 5), actual2: newTimeSpan3(2, 3, 4), expected: false },
      { actual1: newTimeSpan5(1, 2, 3, 4, 5), actual2: newTimeSpan5(1, 2, 3, 4, 5), expected: true },
      { actual1: newTimeSpan5(1, 2, 3, 4, 5), actual2: newTimeSpan5(1, 2, 3, 4, 6), expected: false },
      { actual1: newTimeSpan5(1, 2, 3, 4, 5), actual2: newTimeSpan5(1, 2, 3, 5, 5), expected: false },
      { actual1: newTimeSpan5(1, 2, 3, 4, 5), actual2: newTimeSpan5(1, 2, 4, 4, 5), expected: false },
      { actual1: newTimeSpan5(1, 2, 3, 4, 5), actual2: newTimeSpan5(1, 3, 3, 4, 5), expected: false },
      { actual1: newTimeSpan5(1, 2, 3, 4, 5), actual2: newTimeSpan5(2, 2, 3, 4, 5), expected: false },
      { actual1: newTimeSpan5(1, 2, 3, 4, 5), actual2: newTimeSpan5(2, 2, 3, 4, 5), expected: false },
      { actual1: newTimeSpan5(1, 2, 3, 4, 5), actual2: newTimeSpan4(1, 2, 3, 4), expected: false },
      { actual1: newTimeSpan5(1, 2, 3, 4, 5), actual2: newTimeSpan3(2, 2, 3), expected: false },

      { actual1: newTimeSpan1(10000), actual2: newTimeSpan1(10000), expected: true },
      { actual1: newTimeSpan1(10000), actual2: newTimeSpan1(20000), expected: false },
      { actual1: newTimeSpan1(10000), actual2: null, expected: false }
    ];

    // Assert
    data.forEach(({actual1, actual2, expected}) => {
      expect(actual1.equal(actual2)).to.deep.equal(expected);
    });
  });

  it('should create TimeSpan from days', () => {
    // Arrange
    let data = [
      { days: 100.50000001, expected: newTimeSpan5(100, 12, 0, 0, 1) },
      { days: 2.5, expected: newTimeSpan4(2, 12, 0, 0) },
      { days: 1.0, expected: newTimeSpan4(1, 0, 0, 0) },
      { days: 0.0, expected: newTimeSpan4(0, 0, 0, 0) },
      { days: -1.0, expected: newTimeSpan4(-1, 0, 0, 0) },
      { days: -2.5, expected: newTimeSpan4(-2, -12, 0, 0) },
      { days: -100.50000001, expected: newTimeSpan5(-100, -12, 0, 0, -1) }
    ];

    // Assert
    data.forEach(({days, expected}) => {
      expect(TimeSpan.fromDays(days)).to.deep.equal(expected);
    });
  });

  it('should throw error if pass invalid number of days', () => {
    // Arrange
    let maxDays = Number.MAX_VALUE / (TimeSpan.TicksPerMillisecond / 1000.0 / 60.0 / 60.0 / 24.0);

    // Assert
    expect(() => TimeSpan.fromDays(Infinity)).to.throw('Overflow error');
    expect(() => TimeSpan.fromDays(-Infinity)).to.throw('Overflow error');

    expect(() => TimeSpan.fromDays(maxDays)).to.throw('Overflow error');
    expect(() => TimeSpan.fromDays(maxDays)).to.throw('Overflow error');

    expect(() => TimeSpan.fromDays(NaN)).to.throw('Argument error');
  });

  it('should create TimeSpan from hours', () => {
    // Arrange
    let data = [
      { hours: 100.500001, expected: newTimeSpan5(4, 4, 30, 0, 4) },
      { hours: 2.5, expected: newTimeSpan3(2, 30, 0) },
      { hours: 1.0, expected: newTimeSpan3(1, 0, 0) },
      { hours: 0.0, expected: newTimeSpan3(0, 0, 0) },
      { hours: -1.0, expected: newTimeSpan3(-1, 0, 0) },
      { hours: -2.5, expected: newTimeSpan3(-2, -30, 0) },
      { hours: -100.500001, expected: newTimeSpan5(-4, -4, -30, 0, -4) }
    ];

    // Assert
    data.forEach(({hours, expected}) => {
      expect(TimeSpan.fromHours(hours)).to.deep.equal(expected);
    });
  });

  it('should throw error if pass invalid number of hours', () => {
    // Arrange
    let maxHours = Number.MAX_VALUE / (TimeSpan.TicksPerMillisecond / 1000.0 / 60.0 / 60.0);

    // Assert
    expect(() => TimeSpan.fromHours(Infinity)).to.throw('Overflow error');
    expect(() => TimeSpan.fromHours(-Infinity)).to.throw('Overflow error');

    expect(() => TimeSpan.fromHours(maxHours)).to.throw('Overflow error');
    expect(() => TimeSpan.fromHours(maxHours)).to.throw('Overflow error');

    expect(() => TimeSpan.fromHours(NaN)).to.throw('Argument error');
  });

  it('should create TimeSpan from minutes', () => {
    // Arrange
    let data = [
      { minutes: 100.50001, expected: newTimeSpan5(0, 1, 40, 30, 1) },
      { minutes: 2.5, expected: newTimeSpan3(0, 2, 30) },
      { minutes: 1.0, expected: newTimeSpan3(0, 1, 0) },
      { minutes: 0.0, expected: newTimeSpan3(0, 0, 0) },
      { minutes: -1.0, expected: newTimeSpan3(0, -1, 0) },
      { minutes: -2.5, expected: newTimeSpan3(0, -2, -30) },
      { minutes: -100.50001, expected: newTimeSpan5(0, -1, -40, -30, -1) }
    ];

    // Assert
    data.forEach(({minutes, expected}) => {
      expect(TimeSpan.fromMinutes(minutes)).to.deep.equal(expected);
    });
  });

  it('should throw error if pass invalid number of minutes', () => {
    // Arrange
    let maxMinutes = Number.MAX_VALUE / (TimeSpan.TicksPerMillisecond / 1000.0 / 60.0);

    // Assert
    expect(() => TimeSpan.fromMinutes(Infinity)).to.throw('Overflow error');
    expect(() => TimeSpan.fromMinutes(-Infinity)).to.throw('Overflow error');

    expect(() => TimeSpan.fromMinutes(maxMinutes)).to.throw('Overflow error');
    expect(() => TimeSpan.fromMinutes(maxMinutes)).to.throw('Overflow error');

    expect(() => TimeSpan.fromMinutes(NaN)).to.throw('Argument error');
  });

  it('should create TimeSpan from seconds', () => {
    // Arrange
    let data = [
      { seconds: 100.0005, expected: newTimeSpan5(0, 0, 1, 40, 1) },
      { seconds: 2.5, expected: newTimeSpan5(0, 0, 0, 2, 500) },
      { seconds: 1.0, expected: newTimeSpan5(0, 0, 0, 1, 0) },
      { seconds: 0.0, expected: newTimeSpan5(0, 0, 0, 0, 0) },
      { seconds: -1.0, expected: newTimeSpan5(0, 0, 0, -1, 0) },
      { seconds: -2.5, expected: newTimeSpan5(0, 0, 0, -2, -500) },
      { seconds: -100.0005, expected: newTimeSpan5(0, 0, -1, -40, -1) }
    ];

    // Assert
    data.forEach(({seconds, expected}) => {
      expect(TimeSpan.fromSeconds(seconds)).to.deep.equal(expected);
    });
  });

  it('should throw error if pass invalid number of seconds', () => {
    // Arrange
    let maxSeconds = Number.MAX_VALUE / (TimeSpan.TicksPerMillisecond / 1000.0);

    // Assert
    expect(() => TimeSpan.fromSeconds(Infinity)).to.throw('Overflow error');
    expect(() => TimeSpan.fromSeconds(-Infinity)).to.throw('Overflow error');

    expect(() => TimeSpan.fromSeconds(maxSeconds)).to.throw('Overflow error');
    expect(() => TimeSpan.fromSeconds(maxSeconds)).to.throw('Overflow error');

    expect(() => TimeSpan.fromSeconds(NaN)).to.throw('Argument error');
  });

  it('should create TimeSpan from milliseconds', () => {
    // Arrange
    let data = [
      { milliseconds: 1500.5, expected: newTimeSpan5(0, 0, 0, 1, 501) },
      { milliseconds: 2.5, expected: newTimeSpan5(0, 0, 0, 0, 3) },
      { milliseconds: 1.0, expected: newTimeSpan5(0, 0, 0, 0, 1) },
      { milliseconds: 0.0, expected: newTimeSpan5(0, 0, 0, 0, 0) },
      { milliseconds: -1.0, expected: newTimeSpan5(0, 0, 0, 0, -1) },
      { milliseconds: -2.5, expected: newTimeSpan5(0, 0, 0, 0, -3) },
      { milliseconds: -1500.5, expected: newTimeSpan5(0, 0, 0, -1, -501) }
    ];

    // Assert
    data.forEach(({milliseconds, expected}) => {
      expect(TimeSpan.fromMilliseconds(milliseconds)).to.deep.equal(expected);
    });
  });

  it('should throw error if pass invalid number of milliseconds', () => {
    // Arrange
    let maxMilliseconds = Number.MAX_VALUE / (TimeSpan.TicksPerMillisecond);

    // Assert
    expect(() => TimeSpan.fromMilliseconds(Infinity)).to.throw('Overflow error');
    expect(() => TimeSpan.fromMilliseconds(-Infinity)).to.throw('Overflow error');

    expect(() => TimeSpan.fromMilliseconds(maxMilliseconds)).to.throw('Overflow error');
    expect(() => TimeSpan.fromMilliseconds(maxMilliseconds)).to.throw('Overflow error');

    expect(() => TimeSpan.fromMilliseconds(NaN)).to.throw('Argument error');
  });

  it('should create TimeSpan from ticks', () => {
    // Arrange
    let data = [
      { ticks: TimeSpan.TicksPerMillisecond, expected: newTimeSpan5(0, 0, 0, 0, 1) },
      { ticks: TimeSpan.TicksPerSecond, expected: newTimeSpan5(0, 0, 0, 1, 0) },
      { ticks: TimeSpan.TicksPerMinute, expected: newTimeSpan5(0, 0, 1, 0, 0) },
      { ticks: TimeSpan.TicksPerHour, expected: newTimeSpan5(0, 1, 0, 0, 0) },
      { ticks: TimeSpan.TicksPerDay, expected: newTimeSpan5(1, 0, 0, 0, 0) },

      { ticks: 1.0, expected: newTimeSpan1(1) },
      { ticks: 0.0, expected: newTimeSpan3(0, 0, 0) },
      { ticks: -1.0, expected: newTimeSpan1(-1) },

      { ticks: -TimeSpan.TicksPerDay, expected: newTimeSpan5(-1, 0, 0, 0, 0) },
      { ticks: -TimeSpan.TicksPerHour, expected: newTimeSpan5(0, -1, 0, 0, 0) },
      { ticks: -TimeSpan.TicksPerMinute, expected: newTimeSpan5(0, 0, -1, 0, 0) },
      { ticks: -TimeSpan.TicksPerSecond, expected: newTimeSpan5(0, 0, 0, -1, 0) },
      { ticks: -TimeSpan.TicksPerMillisecond, expected: newTimeSpan5(0, 0, 0, 0, -1) }
    ];

    // Assert
    data.forEach(({ticks, expected}) => {
      expect(TimeSpan.fromTicks(ticks)).to.deep.equal(expected);
    });
  });

  it('should permit negations', () => {
    // Arrange
    let data = [
      { actual: newTimeSpan3(0, 0, 0), expected: newTimeSpan3(0, 0, 0) },
      { actual: newTimeSpan3(1, 2, 3), expected: newTimeSpan3(-1, -2, -3) },
      { actual: newTimeSpan3(-1, -2, -3), expected: newTimeSpan3(1, 2, 3) },
      { actual: newTimeSpan1(12345), expected: newTimeSpan1(-12345) },
      { actual: newTimeSpan1(-12345), expected: newTimeSpan1(12345) }
    ];

    // Assert
    data.forEach(({actual, expected}) => {
      expect(actual.negate()).to.deep.equal(expected);
    });
  });

  it('should create TimeSpan parsing string', () => {
    // Arrange
    let data = [
      { value: '       12:24:02', expected: newTimeSpan5(0, 12, 24, 2, 0) },
      { value: '12:24', expected: newTimeSpan5(0, 12, 24, 0, 0) },
      { value: '12:24:02', expected: newTimeSpan5(0, 12, 24, 2, 0) },
      { value: '1.12:24:02', expected: newTimeSpan5(1, 12, 24, 2, 0) },
      { value: '1.12:24:02.999', expected: newTimeSpan5(1, 12, 24, 2, 999) },
      { value: '-12:24:02', expected: newTimeSpan5(0, -12, -24, -2, 0) },
      { value: '-1.12:24:02.999', expected: newTimeSpan5(-1, -12, -24, -2, -999) }
    ];

    // Assert
    data.forEach(({value, expected}) => {
      expect(TimeSpan.parse(value)).to.deep.equal(expected);
    });
  });

  it('should throw format error if pass invalid input', () => {
    // Arrange
    let data = [
      { value: '' },
      { value: '-' },
      { value: 'garbage' },
      { value: '12/12/12' }
    ];

    // Assert
    data.forEach(({value}) => {
      expect(() => TimeSpan.parse(value)).to.throw('Format error');
    });
  });

  it('should permit subtractions', () => {
    // Arrange
    let data = [
      { actual1: newTimeSpan3(0, 0, 0), actual2: newTimeSpan3(1, 2, 3), expected: newTimeSpan3(-1, -2, -3) },
      { actual1: newTimeSpan3(1, 2, 3), actual2: newTimeSpan3(4, 5, 6), expected: newTimeSpan3(-3, -3, -3) },
      { actual1: newTimeSpan3(1, 2, 3), actual2: newTimeSpan3(-4, -5, -6), expected: newTimeSpan3(5, 7, 9) },
      { actual1: newTimeSpan5(1, 2, 3, 4, 5), actual2: newTimeSpan3(1, 2, 3), expected: newTimeSpan5(1, 1, 1, 1, 5) },
      { actual1: newTimeSpan5(10, 11, 12, 13, 14), actual2: newTimeSpan5(1, 2, 3, 4, 5), expected: newTimeSpan5(9, 9, 9, 9, 9) },
      { actual1: newTimeSpan1(200000), actual2: newTimeSpan1(10000), expected: newTimeSpan1(190000) }
    ];

    // Assert
    data.forEach(({actual1, actual2, expected}) => {
      expect(actual1.subtract(actual2)).to.deep.equal(expected);
    });
  });

  it('should throw overflow error if difference is beyond limits', () => {
    // Assert
    expect(() => TimeSpan.MinValue.subtract(newTimeSpan1(1))).to.throw('Overflow error');
    expect(() => TimeSpan.MaxValue.subtract(newTimeSpan1(-1))).to.throw('Overflow error');
  });

  it('should return a string representation', () => {
    let data = [
      { actual: newTimeSpan3(0, 0, 0), expected: '00:00:00' },
      { actual: newTimeSpan3(1, 2, 3), expected: '01:02:03' },
      { actual: newTimeSpan3(-1, -2, -3), expected: '-01:02:03' },
      { actual: newTimeSpan4(1, 2, 3, 4), expected: '1.02:03:04' },
      { actual: newTimeSpan4(-1, -2, -3, -4), expected: '-1.02:03:04' },
      { actual: newTimeSpan5(1, 2, 3, 4, 5), expected: '1.02:03:04.005' },
      { actual: newTimeSpan5(-1, -2, -3, -4, -5), expected: '-1.02:03:04.005' }
    ];

    data.forEach(({actual, expected}) => {
      expect(actual.toString()).to.equal(expected);
    });
  });

  function verifyTimeSpan(timeSpan: TimeSpan, days: number, hours: number, minutes: number, seconds: number, milliseconds: number) {
    expect(timeSpan.days).to.equal(days);
    expect(timeSpan.hours).to.equal(hours);
    expect(timeSpan.minutes).to.equal(minutes);
    expect(timeSpan.seconds).to.equal(seconds);
    expect(timeSpan.milliseconds).to.equal(milliseconds);
  }

  function getTimeSpanParams(days: number, hours: number, minutes: number, seconds: number, milliseconds: number) {
    return { days, hours, minutes, seconds, milliseconds };
  }

  function newTimeSpan1(ticks: number) {
    return new TimeSpan({ ticks });
  }

  function newTimeSpan3(hours: number, minutes: number, seconds: number) {
    return new TimeSpan({ hours, minutes, seconds });
  }

  function newTimeSpan4(days: number, hours: number, minutes: number, seconds: number) {
    return new TimeSpan({ days, hours, minutes, seconds });
  }

  function newTimeSpan5(days: number, hours: number, minutes: number, seconds: number, milliseconds: number) {
    return new TimeSpan({ days, hours, minutes, seconds, milliseconds });
  }
});
