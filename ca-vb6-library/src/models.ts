import { GetEmptyBuffer, VB6Truncate } from "./functions";

export enum MsgBoxStyle {
  // OK button only (default). This member is equivalent to the Visual Basic constant,
  // vbOKOnly.
  OkOnly = 0,
  // First button is default. This member is equivalent to the Visual Basic constant,
  // vbDefaultButton1.
  DefaultButton1 = 0,
  // Application modal message box. This member is equivalent to the Visual Basic,
  // constant vbApplicationModal.
  ApplicationModal = 0,
  // OK and Cancel buttons. This member is equivalent to the Visual Basic constant,
  // vbOKCancel.
  OkCancel = 1,
  // Abort, Retry, and Ignore buttons. This member is equivalent to the Visual Basic,
  // constant vbAbortRetryIgnore.
  AbortRetryIgnore = 2,
  // Yes, No, and Cancel buttons. This member is equivalent to the Visual Basic constant,
  // vbYesNoCancel.
  YesNoCancel = 3,
  // Yes and No buttons. This member is equivalent to the Visual Basic constant vbYesNo.
  YesNo = 4,
  // Retry and Cancel buttons. This member is equivalent to the Visual Basic constant,
  // vbRetryCancel.
  RetryCancel = 5,
  // Critical message. This member is equivalent to the Visual Basic constant vbCritical.
  Critical = 16,
  // Warning query. This member is equivalent to the Visual Basic constant vbQuestion.
  Question = 32,
  // Warning message. This member is equivalent to the Visual Basic constant vbExclamation.
  Exclamation = 48,
  // Information message. This member is equivalent to the Visual Basic constant vbInformation.
  Information = 64,
  // Second button is default. This member is equivalent to the Visual Basic constant,
  // vbDefaultButton2.
  DefaultButton2 = 256,
  // Third button is default. This member is equivalent to the Visual Basic constant,
  // vbDefaultButton3.
  DefaultButton3 = 512,
  // System modal message box. This member is equivalent to the Visual Basic constant,
  // vbSystemModal.
  SystemModal = 4096,
  // Help text. This member is equivalent to the Visual Basic constant vbMsgBoxHelp.
  MsgBoxHelp = 16384,
  // Foreground message box window. This member is equivalent to the Visual Basic,
  // constant vbMsgBoxSetForeground.
  MsgBoxSetForeground = 65536,
  // Right-aligned text. This member is equivalent to the Visual Basic constant vbMsgBoxRight.
  MsgBoxRight = 524288,
  // Right-to-left reading text (Hebrew and Arabic systems). This member is equivalent,
  // to the Visual Basic constant vbMsgBoxRtlReading.
  MsgBoxRtlReading = 1048576
}

export enum MsgBoxResult {
  Ok = 1,
  Cancel = 2,
  Abort = 3,
  Retry = 4,
  Ignore = 5,
  Yes = 6,
  No = 7
}

/**
 * Context control node
 */
export interface IControlNode<TControl = any> {
  /**
   * Control instance
   */
  instance?: TControl;
  /**
   * Component container
   */
  componentView?: {
    /**
     * Control instance
     */
    component: TControl
  };
  /**
   * Converts collection to array
   */
  toArray?();
}


/**
 * Collection
 */
export class Collection6 extends Array {
  /**
   * Gets the number of items contained in the collection
   */
  public get Count() {
    return this.length;
  }

  /**
   * Adds an element to a Collection object.
   * @param Item An object of any type that specifies the element to add to the collection.
   * @param Key A unique String expression that specifies a key string that can be used instead of a positional index to access this new element in the collection.
   */
  public Add<TValue = any>(Item: TValue, Key?: string) {
    if (Key != undefined) {
      this[Key] = Item;
    } else {
      this.push(Item);
    }
  }
}

/**
 * VB6 Fixed length string
 */
export class VB6FixedString {
  /**
   * The string value
   */
  public get value(): string {
    return VB6Truncate(this._buffer, this._bufferSize, ' ');
  }
  public set value(value: string) {
    this._buffer = VB6Truncate(value, this._bufferSize);
  }
  /**
   * The internal buffer
   */
  private _buffer: string;
  /**
   * The internal buffer size
   */
  private _bufferSize: number;

  constructor(size: number) {
    this._bufferSize = size;
    this._buffer = GetEmptyBuffer(size);
  }
}

/**
 * VB6 Radio option
 */
export class VB6RadioOption<TValue = any> {
  /**
   * Radio value
   */
  public value: TValue;

  constructor(get: () => boolean, set: () => void) {
    Object.defineProperty(this, 'value', {
      get,
      set: (value: boolean) => {
        if (value) {
          set();
        }
      }
    });
  }
}

/**
 * Registered objects
 */
export const VB6Objects: { [key: string]: any } = {};