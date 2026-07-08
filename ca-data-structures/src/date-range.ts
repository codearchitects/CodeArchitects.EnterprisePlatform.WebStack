/**
 * Represents a date range by start date and end date.
 */
export class DateRange {
  public constructor(
    private _start = <Date>undefined,
    private _end = <Date>undefined
  ) { }

  /**
   * Start date
   */
  public get start() { return this._start; }
  public set start(value: Date) { this._start = value; }

  /**
   * End date
   */
  public get end() { return this._end; }
  public set end(value: Date) { this._end = value; }
}
