import { EventEmitter } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, throttleTime } from "rxjs/operators";

/**
 * Use in components with the @Output directive to emit custom events ignoring subsequent source
 * values for duration milliseconds (throttleTime), and register handlers for those events by subscribing to an instance.
 * REMEMBER to call the unsubscribe method when finish.
 */
export class ThrottledEventEmitter<T> extends EventEmitter<T> {
  /**
   * Use in components with the @Output directive to emit custom events ignoring subsequent source
   * values for duration milliseconds (throttleTime), and register handlers for those events by subscribing to an instance.
   * REMEMBER to call the unsubscribe method when finish.
   * @param _throttleTime Emits a value from the source Observable,
   * then ignores subsequent source values for duration milliseconds,
   * then repeats this process.
   */
  constructor(private _throttleTime = 0) {
    super();
    this._emit$
      .pipe(
        throttleTime(_throttleTime),
        takeUntil(this._unsubscribe$)
      ).subscribe(value => {
        super.emit(value);
        console.log(value);
      });
  }
  /**
   * Internal emitter
   */
  private _emit$ = new Subject<any>();
  /**
   * Emits an event to make _emit$ unsubscribe possible
   */
  private _unsubscribe$ = new Subject<void>();

  /**
   * Unsubscribes from source
   */
  public unsubscribe() {
    super.unsubscribe();
    this._unsubscribe$.next();
  }

  /**
   * Emits an event containing a given value (considering the throttle time).
   * @param value The value to emit.
   */
  public emit(value?: any) {
    this._emit$.next(value);
  }
}
