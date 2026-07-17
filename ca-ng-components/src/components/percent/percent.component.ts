import { Component, Injector } from '@angular/core';
import * as _ from 'lodash';
import { FormDesignerControl } from 'src/decorators';
import { SH_CHANGE_DETECTOR } from 'src/environments/change-detection-strategy';
import { ShFormControlMode } from './../../utilities/form-control.utility';
import { IShNumberOptions, ShNumberComponent } from './../number/number.component';

@FormDesignerControl({
  name: 'percent',
  shortDescription: 'Percent Control'
})
@Component({
  selector: 'sh-percent',
  templateUrl: '../number/number.component.html',
  styleUrls: ['../number/number.component.scss'],
  changeDetection: SH_CHANGE_DETECTOR.STRATEGY
 })
/**
 * Base Percent Component
 */
export class ShPercentComponent
  extends ShNumberComponent<IShNumberOptions> {
  /**
   * Base Percent Component
   */
  constructor(injector: Injector) {
    super(injector);
  }

  protected formatModelValue(value = this.getModelValue()) {
    if (this.mode === ShFormControlMode.Edit) {
      value = value && value * 100;
    }
    return super.formatModelValue(value);
  }

  protected parseControlValue(value = this.getControlValue()) {
    let parsedValue = super.parseControlValue(value);
    if (this.mode === ShFormControlMode.Edit) {
      parsedValue = parsedValue && parsedValue / 100;
    }
    return parsedValue;
  }

  protected checkLimits(value: number, min = this.internalOptions.min, max = this.internalOptions.max) {
    if (this.mode === ShFormControlMode.Browse) {
      return super.checkLimits(value, min, max);
    } else {
      return super.checkLimits(value, min * 100, max * 100);
    }
  }

  protected getDefaultOptions(): IShNumberOptions {
    return _.merge(super.getDefaultOptions(), {
      format: '0 %',
      step: .01
    });
  }

  protected getEditFormat() {
    return super.getEditFormat().replace(/\s*\%\s*/g, '');
  }
}
