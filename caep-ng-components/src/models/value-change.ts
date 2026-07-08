import { EventEmitter } from '@angular/core';

/**
 * ValueChange class for encapsulation of property change requests
 */
export class CaepValueChange<T> {
  /**
   * Value of the model property
   */
  public get currentValue(): T {
    return this._model[this._prop];
  }

  constructor(
    private _model: { [id: string]: any },
    private _prop: string,
    public nextValue: T,
    public valueChangesEmitter: EventEmitter<T>
  ) {}

  /**
   * Authorize the request of property value change
   */
  public authorize() {
    this._model[this._prop] = this.nextValue;
    this.valueChangesEmitter.emit(this._model[this._prop]);
  }
}
