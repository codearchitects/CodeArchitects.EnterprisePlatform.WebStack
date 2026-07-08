export class DateOnly extends Date {}

/**
 * Casts Ecma date object to DateOnly structure.
 * @param date Date to be cast.
 * @returns DateOnly
 */
export function toDateOnly(date: Date): DateOnly {
  if (!date || isNaN(date.getTime())) return null;
  const startOfDay = new Date(date.toDateString());
  return new DateOnly(
    startOfDay.getTime() - startOfDay.getTimezoneOffset() * 60000
  );
}
