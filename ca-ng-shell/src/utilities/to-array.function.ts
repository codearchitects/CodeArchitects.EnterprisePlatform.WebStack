export function toArray<T>(value: T | T[]): T[] {
  if (!(value instanceof Array)) {
    return [value];
  } else {
    return value;
  }
}
