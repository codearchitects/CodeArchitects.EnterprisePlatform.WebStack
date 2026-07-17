import { Component, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { FormDesignerControl } from 'src/decorators';
import { SH_CHANGE_DETECTOR } from 'src/environments/change-detection-strategy';
import { shNumeral } from '../../utilities/numeral.utility';
import { NumberParserService } from './../../services/number-parser.service';
import { ShFormControlMode } from './../../utilities/form-control.utility';
import { KeyCode } from './../../utilities/key-code.const';
import { IShBaseFormattedOptions, ShBaseFormattedComponent } from './../base/base-formatted.component';
/**
 * Base Numeric Component options contract
 */
export interface IShNumberOptions
  extends IShBaseFormattedOptions<number> {
  /**
   * Min value reachable from control
   */
  min?: number;
  /**
   * Max value reachable from control
   */
  max?: number;
  /**
   * Step value
   */
  step?: number;
}

@FormDesignerControl({
  name: 'number',
  shortDescription: 'Number Control'
})
@Component({
  selector: 'sh-number',
  templateUrl: './number.component.html',
  styleUrls: ['number.component.scss'],
  changeDetection: SH_CHANGE_DETECTOR.STRATEGY
 })
/**
 * Base Numeric Component
 */
export class ShNumberComponent<O extends IShNumberOptions>
  extends ShBaseFormattedComponent<number, O> {
  /**
   * Number Parser Service
   */
  protected numberParser: NumberParserService;
  /**
   * Translate Service
   */
  protected translateService: TranslateService;
  /**
   * Specifies if control allows negative numbers
   */
  private get allowNegative() {
    return this.internalOptions.min === undefined || this.internalOptions.min < 0;
  }
  /**
   * Maximum fraction digits
   */
  private get maximumFractionDigits() {
    const parts = this.internalOptions.format.replace(/[^0-9\.]/g, '').split('.');
    if (parts.length < 2) {
      return 0;
    }
    return parts[1].length;
  }

  /**
   * Base Numeric Component
   */
  constructor(injector: Injector) {
    super(injector);
    this.numberParser = injector.get(NumberParserService);
  }

  /**
   * Event fired on control key down
   * @param e Keyboard event
   */
  protected onKeyDown(e: KeyboardEvent) {
    if (this.enable && !this.internalOptions.isReadonly) {
      switch (e.keyCode) {
        case KeyCode.ARROW_UP:
          this.increase();
          e.preventDefault();
          break;
        case KeyCode.ARROW_DOWN:
          this.decrease();
          e.preventDefault();
          break;
      }
    }
  }

  /**
   * Increase value
   */
  protected increase() {
    const newValue = shNumeral.set(this.getModelValue()).add(this.internalOptions.step).value();
    this.updateValue(newValue);
  }

  /**
   * Decrease value
   */
  protected decrease() {
    const newValue = shNumeral.set(this.getModelValue()).subtract(this.internalOptions.step).value();
    this.updateValue(newValue);
  }

  /**
   * Checks if limits are exceeded
   * @param value Value for which performs check
   * @param min Minimum value
   * @param max Maximum value
   */
  protected checkLimits(value: number, min = this.internalOptions.min, max = this.internalOptions.max) {
    if (min !== undefined && value < min) {
      value = undefined;
    }
    if (max !== undefined && value > max) {
      value = undefined;
    }
    return value;
  }

  /**
   * Provides control edit format
   */
  protected getEditFormat() {
    const format = this.internalOptions.format;
    return format === '0,0' ? '0' : format.replace(/\,/g, '');
  }

  protected createFormControl() {
    super.createFormControl();
    if (this.formControl) {
      // this.formControl.validator = ShValidators.compose([this.formControl.validator, ShValidators.number(this.allowNegative, this.maximumFractionDigits, this.internalOptions.format)]);
      this.formControl.browseFormat = this.internalOptions.format;
      this.formControl.editFormat = this.getEditFormat();
    }
  }

  protected tolerantCheck() {
    return this.numberParser.tolerantCheck(this.getControlValue(), this.allowNegative, this.maximumFractionDigits);
  }

  protected parseControlValue(value = this.getControlValue()) {
    return this.mode === ShFormControlMode.Browse ? this.getModelValue() : this.parseValue(value);
  }

  protected formatModelValue(value = this.getModelValue()) {
    const format = this.mode === ShFormControlMode.Browse ? this.internalOptions.format : this.getEditFormat();
    return value !== undefined ? shNumeral.set(value).format(format) : undefined;
  }

  protected getDefaultOptions(): IShNumberOptions {
    return _.merge(super.getDefaultOptions(), {
      format: '0,0',
      step: 1,
    });
  }

  /**
   * Update model/control value
   * @param value New value
   */
  private updateValue(value: number) {
    const normValue = this.normalize(value);
    if (this.mode === ShFormControlMode.Browse) {
      this.updateModelValue(normValue);
    } else {
      this.updateControlValue(this.formatModelValue(normValue));
    }
  }

  /**
   * Parses model value
   * @param value the value
   */
  private parseValue(value: string) {
    if (this.numberParser.strictCheck(value, this.allowNegative, this.maximumFractionDigits)) {
      let modelValue = this.numberParser.strictParse(this.getControlValue(), this.allowNegative, this.maximumFractionDigits);
      modelValue = this.checkLimits(modelValue);
      return modelValue;
    }
    return undefined;
  }

  /**
   * Normalizes value
   * @param value the value
   */
  private normalize(value: number) {
    value = this.normalizeInvalid(value);
    value = this.normalizeMin(value);
    value = this.normalizeMax(value);
    return value;
  }

  /**
   * Normalization for invalid value
   * @param value The value
   */
  private normalizeInvalid(value: number) {
    return isNaN(value) ? 0 : value;
  }

  /**
   * Normalization for min value
   * @param value The value
   */
  private normalizeMin(value: number) {
    return this.internalOptions.min !== undefined && value < this.internalOptions.min ? this.internalOptions.min : value;
  }

  /**
   * Normalization for max value
   * @param value The value
   */
  private normalizeMax(value: number) {
    return this.internalOptions.max !== undefined && value > this.internalOptions.max ? this.internalOptions.max : value;
  }
}
