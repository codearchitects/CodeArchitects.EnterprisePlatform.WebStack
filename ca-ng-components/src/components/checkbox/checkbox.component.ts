import { Component, OnInit, Injector } from '@angular/core';
import { ShBaseInputComponent, IShBaseInputOptions } from '../base/base-input.component';
import { IN } from '../../utilities/common.utility';
import { KeyCode } from '../../utilities/key-code.const';
import { SH_CHANGE_DETECTOR } from 'src/environments/change-detection-strategy';
import { FormDesignerControl } from 'src/decorators';

/**
 * Base Checkbox Component options contract
 */
export interface IShCheckboxOptions
  extends IShBaseInputOptions<boolean> {
  /**
   * Text to put next to the control
   */
  label?: string;
}


@FormDesignerControl({
  name: 'checkbox',
  shortDescription: 'Checkbox Control'
})
@Component({
  selector: 'sh-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: SH_CHANGE_DETECTOR.STRATEGY
 })
/**
 * Base Checkbox Component
 */
export class ShCheckboxComponent
  extends ShBaseInputComponent<boolean, IShCheckboxOptions> {

  /**
  * Base Currency Component
  */
  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * Event fired on key
   * @param e Keyboard event
   */
  protected onKey(e: KeyboardEvent) {
    if (this.enable && !this.internalOptions.isReadonly) {
      const keycode = e.keyCode || e.which;
      if (IN(keycode, KeyCode.ENTER, KeyCode.SPACE)) {
        this.toggle();
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }

  /**
   * Toggles control value
   */
  protected toggle() {
    if (this.enable && !this.internalOptions.isReadonly) {
      this.setControlValue(!this.getControlValue());
      this.touch();
    }
  }

  /**
   * Marks form control as touched
   */
  protected touch() {
    if (!this.formControl.touched) {
      this.formControl.markAsTouched();
    }
  }

}
