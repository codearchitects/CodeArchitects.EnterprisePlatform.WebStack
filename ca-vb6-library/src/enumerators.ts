

export enum DateInterval {
  // Year
  Year = 0,
  // Quarter of year (1 through 4)
  Quarter = 1,
  // Month (1 through 12)
  Month = 2,
  // Day of year (1 through 366)
  DayOfYear = 3,
  // Day of month (1 through 31)
  Day = 4,
  // Week of year (1 through 53)
  WeekOfYear = 5,
  // Day of week (1 through 7)
  Weekday = 6,
  // Hour (0 through 23)
  Hour = 7,
  // Minute (0 through 59)
  Minute = 8,
  // Second (0 through 59)
  Second = 9
}

export enum FirstDayOfWeek {
  System = 0,
  Sunday = 1,
  Monday = 2,
  Tuesday = 3,
  Wednesday = 4,
  Thursday = 5,
  Friday = 6,
  Saturday = 7,
}

export enum FirstWeekOfYear {
  System = 0,
  Jan1 = 1,
  FirstFourDays = 2,
  FirstFullWeek = 3
}

export enum CompareMethod {
  /**
   * Performs a binary comparison. This member is equivalent to the Visual Basic constant vbBinaryCompare.
   */
  Binary = 0,
  /**
   * Performs a textual comparison. This member is equivalent to the Visual Basic constant vbTextCompare.
   */
  Text = 1
}

export enum VbStrConv {
  UpperCase = 1,
  LowerCase = 2,
  ProperCase = 3,
  Wide = 4,
  Narrow = 8,
  Katakana = 16,
  Hiragana = 32,
  Unicode = 64, // is not present
  FromUnicode = 128, // is not present
}
