/**
 * Transforms a plain object to a suitable query params.
 * @param obj Object parameter.
 * @returns Query param URI entry.
 */
export function toQueryParams(obj: any): string {
    return obj
      ? Object.keys(obj)
          .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
          .join('&')
      : '';
  }
  