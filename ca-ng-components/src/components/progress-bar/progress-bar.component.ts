import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, Injector, Input, OnChanges } from '@angular/core';
import { IShBaseFormattedOptions, ShBaseAuthComponent } from '../base/index';

@Component({
  selector: 'sh-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
/**
 * Progress bar component
 */
export class ShProgressBarComponent extends ShBaseAuthComponent<IShBaseFormattedOptions<number>> implements OnChanges {
  /**
   * Percentage of progress bar filled
   */
  @Input()
  public set value(value: number) {
    this._value = coerceNumberProperty(value);
    if (this._value > this._max && this.controlRef) {
      console.error(`The 'value' parameter in sh-progress-bar is out of range or incoherent! %o `, this.controlRef.nativeElement);
    }
  }
  public get value() {
    return this._value;
  }
  /**
   * Percentage of progress bar filled
   */
  private _value = 0;
  /**
   * Max bar size
   */
  private readonly MAX_DEFAULT = 100;

  /**
   * Max value of progress bar
   * @default 100
   */
  @Input()
  public set max(max: number) {
    if (max !== undefined && max !== null) {
      this._max = coerceNumberProperty(max);
    } else {
      this._max = this.MAX_DEFAULT;
    }
  }
  public get max() {
    return this._max;
  }
  /**
   * Max value of progress bar
   * @default 100
   */
  private _max = this.MAX_DEFAULT;

  /**
   * Min value of progress bar
   * @default 0
   */
  @Input()
  public set min(min: number) {
    this._min = coerceNumberProperty(min);
  }
  public get min() {
    return this._min;
  }
  /**
   * Min value of progress bar
   * @default 0
   */
  private _min = 0;

  /**
   * If true, the progress bar shows the value label
   * @default false
   */
  @Input()
  public set showLabel(showLabel: boolean) {
    this._showLabel = coerceBooleanProperty(showLabel);
  }
  public get showLabel() {
    return this._showLabel;
  }
  /**
   * If true, the progress bar shows the value label
   * @default false
   */
  private _showLabel = false;

  /**
   * If true, the progress bar is in indeterminate mode
   * @default false
   */
  @Input()
  public set isIndeterminate(isIndeterminate: boolean) {
    this._isIndeterminate = coerceBooleanProperty(isIndeterminate);
  }
  public get isIndeterminate() {
    return this._isIndeterminate;
  }
  /**
   * If true, the progress bar is in indeterminate mode
   * @default false
   */
  private _isIndeterminate = false;

  constructor(injector: Injector) {
    super(injector);
  }

}
