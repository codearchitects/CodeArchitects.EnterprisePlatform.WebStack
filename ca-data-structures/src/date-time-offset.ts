/**
 * Represents a date and time with an offset.
 */
export class DateTimeOffset {
  dateTime: Date;
  offset: number;

  constructor(dateTime: Date, offset: number) {
    this.dateTime = dateTime;
    this.offset = offset;
  }

  /**
   * Creates a DateTimeOffset object from an ISO 8601 string.
   * @param isoString The ISO 8601 string to parse.
   * @returns A new DateTimeOffset object.
   */
  public static fromISO8601String(isoString: string): DateTimeOffset {
    const isoRegex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(\.\d+)?([+-]\d{2}:\d{2}|Z)$/;
    const match = isoRegex.exec(isoString);

    if (!match) {
      console.error("Invalid ISO 8601 string format");
      return new Date(isoString) as unknown as DateTimeOffset;
    }

    const dateTimePart = match[1];

    const offsetPart = match[3];

    const dateTime = new Date(dateTimePart);

    let offsetMinutes = 0;
    if (offsetPart !== "Z") {
      const [offsetSign, offsetHours, offsetMinutesPart] = [
        offsetPart[0], 
        parseInt(offsetPart.slice(1, 3), 10), 
        parseInt(offsetPart.slice(4, 6), 10) 
      ];

      offsetMinutes = offsetHours * 60 + offsetMinutesPart;
      if (offsetSign === "-") {
        offsetMinutes = -offsetMinutes;
      }
    }

    return new DateTimeOffset(dateTime, offsetMinutes);
  }

  /**
   * Converts the DateTimeOffset object to an ISO 8601 formatted string.
   * @returns The ISO 8601 formatted string representation of the DateTimeOffset object.
   */
  public toISO8601String(): string {
    const pad = (n: number) => (n < 10 ? '0' + n : n);

    const offsetHours = Math.floor(Math.abs(this.offset) / 60);
    const offsetMinutes = Math.abs(this.offset) % 60;
    const offsetSign = this.offset >= 0 ? "+" : "-";

    const offsetStr = `${offsetSign}${pad(offsetHours)}:${pad(offsetMinutes)}`;

    const year = this.dateTime.getFullYear();
    const month = pad(this.dateTime.getMonth() + 1);
    const day = pad(this.dateTime.getDate());
    const hours = pad(this.dateTime.getHours());
    const minutes = pad(this.dateTime.getMinutes());
    const seconds = pad(this.dateTime.getSeconds());
    const milliseconds = this.dateTime.getMilliseconds();

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetStr}`;
  }
}