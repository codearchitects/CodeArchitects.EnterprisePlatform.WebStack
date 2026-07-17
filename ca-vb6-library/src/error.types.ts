/**
 * Invalid procedure call or argument error
 */
export class InvalidProcedureCallOrArgumentError extends Error {
  constructor() {
    super('Invalid procedure call or argument');
  }
}

/**
 * Invalid use of null error
 */
export class InvalidUseOfNullError extends Error {
  constructor() {
    super('Invalid use of null');
  }
}

/**
 * Type mismatch error
 */
export class TypeMismatchError extends Error {
  constructor() {
    super('Type mismatch');
  }
}

/**
 * Overflow error
 */
export class OverflowError extends Error {
  constructor(allowedMessage: string) {
    super(`Overflow. Allowed ${allowedMessage}`);
  }
}

/**
 * Format error
 */
export class FormatError extends Error {
  constructor() {
    super(`Input string was not in a correct format`);
  }
}

/**
 * Index out of range error
 */
export class IndexOutOfRangeError extends Error {
  constructor() {
    super(`Index was outside the bounds of the array`);
  }
}

/**
 * Method not supported
 */
export class NotSupportedError extends Error {
  constructor() {
    super(`Not supported`);
  }
}
