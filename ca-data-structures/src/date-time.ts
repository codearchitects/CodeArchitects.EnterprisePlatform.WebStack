/**
 * Represents a date time by date part and time part.
 */
export class DateTime {

  private _date: Date;
  private _time: Date;

  constructor();
  constructor(value: DateTime);
  constructor(value: Date);
  constructor(value: string);
  constructor(value: number);
  constructor(param?: any) {
    if (param instanceof DateTime) {
      this.date = param.date ? new Date(param.date) : undefined;
      this.time = param.time ? new Date(param.time) : undefined;
    } else {
      let date = new Date(param);
      if (!isNaN(date.valueOf())) {
        this.date = new Date();
        this.date.setFullYear(date.getFullYear());
        this.date.setDate(date.getDate());
        this.date.setMonth(date.getMonth());

        this.time = new Date();
        this.time.setHours(date.getHours());
        this.time.setMinutes(date.getMinutes());
        this.time.setSeconds(date.getSeconds());
        this.time.setMilliseconds(date.getMilliseconds());
      }
    }
  }

  /**
   * Date part
   */
  get date() { return this._date; }
  set date(value: Date) { this._date = value; }

  /**
   * Time part
   */
  get time() { return this._time; }
  set time(value: Date) { this._time = value; }

  /**
   * Returns the stored time value in milliseconds since midnight, January 1, 1970 UTC.
   */
  valueOf() {
    return this.toDate() && this.toDate().valueOf();
  }

  /**
   * Returns a date as a string value in ISO format.
   */
  toISOString() {
    return this.toDate() && this.toDate().toISOString();
  }

  /**
   * Returns a js date representation of the date time.
   */
  toDate() {
    if (this.date && this.time) {
      return new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        this.date.getDate(),
        this.time.getHours(),
        this.time.getMinutes(),
        this.time.getSeconds(),
        this.time.getMilliseconds()
      );
    }
  }
}
