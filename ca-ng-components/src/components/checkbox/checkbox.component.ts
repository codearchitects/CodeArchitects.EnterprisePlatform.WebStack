import { Component, OnInit, Injector } from '@angular/core';
import { ShBaseInputComponent, IShBaseInputOptions } from '../base/base-input.component';
import { IN } from '../../utilities/common.utility';
import { KeyCode } from '../../utilities/key-code.const';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';
import { FormDesignerControl } from '../../decorators';

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
    changeDetection: shChangeDetectorStrategy(),
    standalone: false
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
  /*protected*/ public onKey(e: KeyboardEvent) {
    if (!this.internalOptions.isReadonly && this.enable !== false) {
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
  /*protected*/ public toggle() {
    if (!this.internalOptions.isReadonly && this.enable !== false) {
      this.setControlValue(!this.getControlValue());
      this.touch();
      this.formControl.markAsDirty();
    }
  }

  /**
   * Marks form control as touched
   */
  /*protected*/ public touch() {
    if (!this.formControl.touched) {
      this.formControl.markAsTouched();
    }
  }

}
