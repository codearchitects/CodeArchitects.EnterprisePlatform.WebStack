import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CaepAppHeaderService {
  /** The logo visible in header */
  private _logo$ = new BehaviorSubject<string>('');
  /** Actions in flex-end of header */
  private _endActions$ = new BehaviorSubject<string>('');
  /** the logo visible in header */
  public logo$ = this._logo$.asObservable().pipe(tap(r => console.log(r)));
  /** ActionsRight in right side of header */
  public endActions$ = this._endActions$.asObservable();
  /** Set the logo */
  public setLogo(value: string) {
    this._logo$.next(value);
  }
  /** Set the end actions */
  public setEndActions(value: string) {
    this._logo$.next(value);
  }
}
