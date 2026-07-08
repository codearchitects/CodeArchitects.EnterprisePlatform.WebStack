import { Injectable, EventEmitter } from '@angular/core';
import { Context } from '../models/index';

@Injectable()
export class ContextService {

  public contextChange = new EventEmitter<Context>();
  private _context = Context.browse;
  private _isEnabled = false;

  public enable() {
    this._isEnabled = true;
  }
  public disable() {
    this._isEnabled = false;
  }

  public get context() {
    return this._isEnabled ? this._context : undefined;
  }
  public set context(value: Context) {
    this._context = value;
    this.contextChange.emit(this._context);
  }
}
