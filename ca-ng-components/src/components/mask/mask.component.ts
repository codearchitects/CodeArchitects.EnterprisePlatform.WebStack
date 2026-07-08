import { IShTextComponentOptions, ShTextComponent } from './../text/text.component';
import { Component, Injector } from '@angular/core';
import * as _ from 'lodash-es';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';

export interface IShMaskComponentOptions extends IShTextComponentOptions {
  /**
   * Input mask
   */
  mask: string;
  /**
   * Prefix to be added to masked value
   */
  prefix?: string;
  /**
   * Suffix to be added to masked value
   */
  suffix?: string;
  /**
   * Advanced special characters to be supported
   * @default ['-', '/', '(', ')', '.', ':', ' ', '+', ',', '@', '[', ']', '"', "'"]
   */
  specialCharacters?: string[];
  /**
   * If true, mask will drop special character in the model
   * @default true
   */
  dropSpecialCharacters?: boolean;
  /**
   * If true, mask is shown while typing
   * @default false
   */
  showMaskTyped?: boolean;
  /**
   * If true, mask will allow the use of negative numbers
   * @default false
   */
  allowNegativeNumbers?: boolean;
  /**
   * If the showMaskTyped parameter is enabled, this setting customizes
   * the character used as placeholder
   * @default _
   */
  placeHolderCharacter?: string;
  /**
   * If true, if the input value not match the mask, it clear the input
   * @default false
   */
  clearIfNotMatch?: boolean;
  /**
   * If true, skipped symbols of date or time will be replaced by 0
   * @default false
   */
  leadZeroDateTime?: boolean;
  /**
   * If true, hides symbols in input field
   */
  hiddenInput?: boolean;
}

@Component({
    selector: 'sh-mask',
    templateUrl: './mask.component.html',
    styleUrls: ['./mask.component.scss'],
    changeDetection: shChangeDetectorStrategy(),
    standalone: false
})
export class ShMaskComponent extends ShTextComponent<IShMaskComponentOptions> {

  constructor(injector: Injector) {
    super(injector);
  }

  public setModelValue(value: any) {
    if (this.internalOptions.type as any === 'number') {
      value = +value;
    }
    super.setModelValue(value);
  }

  public getDefaultOptions() {
    return _.merge(super.getDefaultOptions(), {
      specialCharacters: ['-', '/', '(', ')', '.', ':', ' ', '+', ',', '@', '[', ']', '"', "'"],
      prefix: '',
      suffix: '',
      dropSpecialCharacters: true,
      showMaskTyped: false,
      allowNegativeNumbers: false,
      placeHolderCharacter: '_',
      clearIfNotMatch: false,
      leadZeroDateTime: false,
      hiddenInput: undefined
    });
  }

}
