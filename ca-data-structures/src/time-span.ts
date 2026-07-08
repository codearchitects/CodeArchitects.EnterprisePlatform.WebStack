export interface ITimeSpanWithHoursMinutesAndSecondsParams {
  hours: number;
  minutes: number;
  seconds: number;
}

function isITimeSpanWithHoursMinutesAndSecondsParams(args: any): args is ITimeSpanWithHoursMinutesAndSecondsParams {
  return args
    && args.hours !== undefined
    && args.minutes !== undefined
    && args.seconds !== undefined;
}

export interface ITimeSpanWithDaysParams extends ITimeSpanWithHoursMinutesAndSecondsParams {
  days: number;
}

function isITimeSpanWithDaysParams(args: any): args is ITimeSpanWithDaysParams {
  return args && args.days !== undefined && isITimeSpanWithHoursMinutesAndSecondsParams(args);
}

export interface ITimeSpanWithMillisecondsParams extends ITimeSpanWithDaysParams {
  milliseconds: number;
}

function isITimeSpanWithMillisecondsParams(args: any): args is ITimeSpanWithMillisecondsParams {
  return args && args.milliseconds !== undefined && isITimeSpanWithDaysParams(args);
}

export interface ITimeSpanTicksParams {
  ticks: number;
}

function isITimeSpanTicksParams(args: any): args is ITimeSpanTicksParams {
  return args && args.ticks !== undefined;
}

export type ITimeSpanParams = ITimeSpanWithHoursMinutesAndSecondsParams | ITimeSpanWithDaysParams | ITimeSpanWithMillisecondsParams | ITimeSpanTicksParams;

/**
 * Represents a time interval.
 */
export class TimeSpan {
  /**
   * Represents the minimum TimeSpan value. This field is read-only.
   */
  public static MinValue = new TimeSpan({ ticks: Number.MIN_SAFE_INTEGER });

  /**
   * Represents the maximum TimeSpan value. This field is read-only.
   */
  public static MaxValue = new TimeSpan({ ticks: Number.MAX_SAFE_INTEGER });

  /**
   * Represents the number of ticks in 1 millisecond. This field is constant.
   */
  public static TicksPerMillisecond = 10000;

  /**
   * Represents the number of ticks in 1 second.
   */
  public static TicksPerSecond = 1000 * TimeSpan.TicksPerMillisecond;

  /**
   * Represents the number of ticks in 1 minute. This field is constant.
   */
  public static TicksPerMinute = 60 * TimeSpan.TicksPerSecond;

  /**
   * Represents the number of ticks in 1 hour. This field is constant.
   */
  public static TicksPerHour = 60 * TimeSpan.TicksPerMinute;

  /**
   * Represents the number of ticks in 1 day.This field is constant.
   */
  public static TicksPerDay = 24 * TimeSpan.TicksPerHour;

  /**
   * Represents the zero TimeSpan value. This field is read-only.
   */
  public static Zero = new TimeSpan({ ticks: 0 });

  private static MillisecondsPerSecond = 1000;
  private static MillisecondsPerMinute = 60 * TimeSpan.MillisecondsPerSecond;
  private static MillisecondsPerHours = 60 * TimeSpan.MillisecondsPerMinute;
  private static MillisecondsPerDays = 24 * TimeSpan.MillisecondsPerHours;

  private ticks = 0;

  /**
   * Returns a TimeSpan that represents a specified number of days, where the specification is accurate to the nearest millisecond.
   *
   * @param value - A number of days, accurate to the nearest millisecond.
   * @return An object that represents value.
   * @throw Value is less than MinValue or greater than MaxValue, or value is ±Infinity.
   * @throw Value is NaN.
   */
  public static fromDays(value: number) {
    if (isNaN(value)) {
      throw Error('Argument error');
    }

    let ticks = TimeSpan.round(value * TimeSpan.MillisecondsPerDays) * TimeSpan.TicksPerMillisecond;

    if (TimeSpan.isBeyondLimits(ticks)) {
      throw Error('Overflow error');
    }

    return new TimeSpan({ ticks: ticks });
  }

  /**
   * Returns a TimeSpan that represents a specified number of hours, where the specification is accurate to the nearest millisecond.
   *
   * @param value - A number of hours accurate to the nearest millisecond.
   * @return An object that represents value.
   * @throw Value is less than MinValue or greater than MaxValue, or value is ±Infinity.
   * @throw Value is NaN.
   */
  public static fromHours(value: number) {
    if (isNaN(value)) {
      throw Error('Argument error');
    }

    let ticks = TimeSpan.round(value * TimeSpan.MillisecondsPerHours) * TimeSpan.TicksPerMillisecond;

    if (TimeSpan.isBeyondLimits(ticks)) {
      throw Error('Overflow error');
    }

    return new TimeSpan({ ticks: ticks });
  }

  /**
   * Returns a TimeSpan that represents a specified number of minutes, where the specification is accurate to the nearest millisecond.
   *
   * @param value - A number of minutes, accurate to the nearest millisecond.
   * @return An object that represents value.
   * @throw Value is less than MinValue or greater than MaxValue, or value is ±Infinity.
   * @throw Value is NaN.
   */
  public static fromMinutes(value: number) {
    if (isNaN(value)) {
      throw Error('Argument error');
    }

    let ticks = TimeSpan.round(value * TimeSpan.MillisecondsPerMinute) * TimeSpan.TicksPerMillisecond;

    if (TimeSpan.isBeyondLimits(ticks)) {
      throw Error('Overflow error');
    }

    return new TimeSpan({ ticks: ticks });
  }

  /**
   * Returns a TimeSpan that represents a specified number of seconds, where the specification is accurate to the nearest millisecond.
   *
   * @param value - A number of seconds, accurate to the nearest millisecond.
   * @return An object that represents value.
   * @throw Value is less than MinValue or greater than MaxValue, or value is ±Infinity.
   * @throw Value is NaN.
   */
  public static fromSeconds(value: number) {
    if (isNaN(value)) {
      throw Error('Argument error');
    }

    let ticks = TimeSpan.round(value * TimeSpan.MillisecondsPerSecond) * TimeSpan.TicksPerMillisecond;

    if (TimeSpan.isBeyondLimits(ticks)) {
      throw Error('Overflow error');
    }

    return new TimeSpan({ ticks: ticks });
  }

  /**
   * Returns a TimeSpan that represents a specified number of milliseconds.
   *
   * @param value - A number of milliseconds.
   * @return An object that represents value.
   * @throw Value is less than MinValue or greater than MaxValue, or value is ±Infinity.
   * @throw Value is NaN.
   */
  public static fromMilliseconds(value: number) {
    if (isNaN(value)) {
      throw Error('Argument error');
    }

    let ticks = TimeSpan.round(value) * TimeSpan.TicksPerMillisecond;

    if (TimeSpan.isBeyondLimits(ticks)) {
      throw Error('Overflow error');
    }

    return new TimeSpan({ ticks: ticks });
  }

  /**
   * Returns a TimeSpan that represents a specified time, where the specification is in units of ticks.
   *
   * @param value - A number of ticks that represent a time.
   * @return An object that represents value.
   */
  public static fromTicks(value: number) {
    return new TimeSpan({ ticks: value });
  }

  /**
   * Converts the string representation of a time interval to its TimeSpan equivalent.
   *
   * @param s - A string that specifies the time interval to convert.
   * @return A time interval that corresponds to s.
   * @throw S has an invalid format.
   */
  public static parse(s: string) {
    const regexp = new RegExp('^(-)?((\\d+)\\.)?(\\d{2}):(\\d{2})(:(\\d{2})(\\.(\\d{3}))?)?$');

    if (!regexp.test(s.trim())) {
      throw Error('Format error');
    }

    let [, sign, , days, hours, minutes, , seconds, , milliseconds] = regexp.exec(s.trim());

    let ticks = 0;

    if (days) {
      ticks += parseInt(days) * TimeSpan.TicksPerDay;
    }

    if (hours) {
      ticks += parseInt(hours) * TimeSpan.TicksPerHour;
    }

    if (minutes) {
      ticks += parseInt(minutes) * TimeSpan.TicksPerMinute;
    }

    if (seconds) {
      ticks += parseInt(seconds) * TimeSpan.TicksPerSecond;
    }

    if (milliseconds) {
      ticks += parseInt(milliseconds) * TimeSpan.TicksPerMillisecond;
    }

    if (sign) {
      ticks = -ticks;
    }

    return new TimeSpan({ ticks: ticks });
  }

  private static isBeyondLimits(ticks: number) {
    return ticks > Number.MAX_SAFE_INTEGER
      || ticks < Number.MIN_SAFE_INTEGER;
  }

  private static round(input: number) {
    let round = Math.round(Math.abs(input));
    return input < 0 ? -1 * round : round;
  }

  private static floor(input: number) {
    let floor = Math.floor(Math.abs(input));
    return input < 0 ? -1 * floor : floor;
  }

  /**
   * Initializes a new instance of the TimeSpan structure.
   *
   * @param args - Hours, minutes and seconds; optionally days and milliseconds; alternatively number of ticks.
   * @throw The parameters specify a TimeSpan value less than TimeSpan.minValue or greater than TimeSpan.maxValue.
   */
  public constructor(args?: ITimeSpanParams) {
    if (isITimeSpanWithHoursMinutesAndSecondsParams(args)) {
      this.ticks += args.hours * TimeSpan.TicksPerHour
        + args.minutes * TimeSpan.TicksPerMinute
        + args.seconds * TimeSpan.TicksPerSecond;
    }

    if (isITimeSpanWithDaysParams(args)) {
      this.ticks += args.days * TimeSpan.TicksPerDay;
    }

    if (isITimeSpanWithMillisecondsParams(args)) {
      this.ticks += args.milliseconds * TimeSpan.TicksPerMillisecond;
    }

    if (TimeSpan.isBeyondLimits(this.ticks)) {
      throw Error('Argument out of range');
    }

    if (isITimeSpanTicksParams(args)) {
      if (args.ticks > Number.MAX_SAFE_INTEGER) {
        this.ticks = Number.MAX_SAFE_INTEGER;
      } else if (args.ticks < Number.MIN_SAFE_INTEGER) {
        this.ticks = Number.MIN_SAFE_INTEGER;
      } else {
        this.ticks = args.ticks;
      }
    }
  }

  /**
   * Gets the days component of the time interval represented by the current TimeSpan structure.
   */
  public get days() { return TimeSpan.floor(this.ticks / TimeSpan.TicksPerDay); }

  /**
   * Gets the hours component of the time interval represented by the current TimeSpan structure.
   */
  public get hours() { return TimeSpan.floor((this.ticks % TimeSpan.TicksPerDay) / TimeSpan.TicksPerHour); }

  /**
   * Gets the minutes component of the time interval represented by the current TimeSpan structure.
   */
  public get minutes() { return TimeSpan.floor((this.ticks % TimeSpan.TicksPerHour) / TimeSpan.TicksPerMinute); }

  /**
   * Gets the seconds component of the time interval represented by the current TimeSpan structure.
   */
  public get seconds() { return TimeSpan.floor((this.ticks % TimeSpan.TicksPerMinute) / TimeSpan.TicksPerSecond); }

  /**
   * Gets the milliseconds component of the time interval represented by the current TimeSpan structure.
   */
  public get milliseconds() { return TimeSpan.floor(this.ticks % TimeSpan.TicksPerSecond / TimeSpan.TicksPerMillisecond); }

  /**
   * Gets the value of the current TimeSpan structure expressed in whole and fractional days.
   */
  public get totalDays() { return this.ticks / TimeSpan.TicksPerDay; }

  /**
   * Gets the value of the current TimeSpan structure expressed in whole and fractional hours.
   */
  public get totalHours() { return this.ticks / TimeSpan.TicksPerHour; }

  /**
   * Gets the value of the current TimeSpan structure expressed in whole and fractional milliseconds.
   */
  public get totalMilliseconds() { return this.ticks / TimeSpan.TicksPerMillisecond; }

  /**
   * Gets the value of the current TimeSpan structure expressed in whole and fractional minutes.
   */
  public get totalMinutes() { return this.ticks / TimeSpan.TicksPerMinute; }

  /**
   * Gets the value of the current TimeSpan structure expressed in whole and fractional seconds.
   */
  public get totalSeconds() { return this.ticks / TimeSpan.TicksPerSecond; }

  /**
   * Returns a new TimeSpan object whose value is the sum of the specified TimeSpan object and this instance.
   *
   * @param ts - The time interval to add.
   * @return A new object that represents the value of this instance plus the value of ts.
   * @throw The resulting TimeSpan is less than TimeSpan.minValue or greater than TimeSpan.maxValue.
   */
  public add(ts: TimeSpan) {
    let ticks = this.ticks + ts.ticks;

    if (TimeSpan.isBeyondLimits(ticks)) {
      throw Error('Overflow error');
    }
    return new TimeSpan({ ticks: ticks });
  }

  /**
   * Compares this instance to a specified TimeSpan object and returns an integer that indicates whether this instance is shorter than, equal to, or longer than the TimeSpan object.
   *
   * @param ts - An object to compare to this instance.
   * @return A signed number indicating the relative values of this instance and value.
   */
  public compareTo(ts: TimeSpan) {
    if (!ts || this.ticks > ts.ticks)
      return 1;
    if (this.ticks < ts.ticks)
      return -1;
    return 0;
  }

  /**
   * Returns a new TimeSpan object whose value is the absolute value of the current TimeSpan object.
   *
   * @return A new object whose value is the absolute value of the current TimeSpan object.
   */
  public duration() {
    return new TimeSpan({ ticks: Math.abs(this.ticks) });
  }

  /**
   * Returns a value indicating whether this instance is equal to a specified TimeSpan object.
   *
   * @param ts - An object to compare with this instance.
   * @return True if ts represents the same time interval as this instance; false otherwise.
   */
  public equal(ts: TimeSpan) {
    return Boolean(ts) && this.ticks === ts.ticks;
  }

  /**
   * Returns a new TimeSpan object whose value is the negated value of this instance.
   *
   * @return A new object with the same numeric value as this instance, but with the opposite sign.
   */
  public negate() {
    return this.ticks ? new TimeSpan({ ticks: -this.ticks }) : new TimeSpan();
  }

  /**
   * Returns a new TimeSpan object whose value is the difference between the specified TimeSpan object and this instance.
   *
   * @param ts - The time interval to be subtracted.
   * @return A new time interval whose value is the result of the value of this instance minus the value of ts.
   * @throw The resulting TimeSpan is less than TimeSpan.minValue or greater than TimeSpan.maxValue.
   */
  public subtract(ts: TimeSpan) {
    let ticks = this.ticks - ts.ticks;

    if (TimeSpan.isBeyondLimits(ticks)) {
      throw Error('Overflow error');
    }
    return new TimeSpan({ ticks: ticks });
  }

  /**
   * Converts the value of the current TimeSpan object to its equivalent string representation.
   *
   * @return The string representation of the current TimeSpan value.
   */
  public toString() {
    let repr = `${this.pad(this.hours)}:${this.pad(this.minutes)}:${this.pad(this.seconds)}`;

    if (this.days) {
      repr = `${this.pad(this.days, 0)}.${repr}`;
    }

    if (this.milliseconds) {
      repr = `${repr}.${this.pad(this.milliseconds, 3)}`;
    }

    if (this.ticks < 0) {
      repr = `-${repr}`;
    }

    return repr;
  }

  private pad(val: number, units = 2) {
    let s = Math.abs(val).toString();
    while (s.length < units) {
      s = `0${s}`;
    }
    return s;
  }
}
