import { Component, Injector } from '@angular/core';
import { FormDesignerControl } from 'src/decorators';
import { SH_CHANGE_DETECTOR } from 'src/environments/change-detection-strategy';
import { IN } from 'src/utilities/common.utility';
import { KeyCode } from 'src/utilities/key-code.const';
import { IShBaseInputOptions, ShBaseInputComponent } from '../base/base-input.component';

/**
 * Toggle component contract
 */
export interface IShToggleOptions extends IShBaseInputOptions<boolean> {
  /**
   * Label flanked to toggle
   */
  label?: string;
}

@FormDesignerControl({
  name: 'toggle',
  shortDescription: 'Toggle Control'
})
@Component({
  selector: 'sh-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  changeDetection: SH_CHANGE_DETECTOR.STRATEGY
})
/**
 * Toggle component
 */
export class ShToggleComponent extends ShBaseInputComponent<boolean, IShToggleOptions> {
  /**
   * Toggle component
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
    this.setControlValue(!this.getControlValue());
    this.touch();
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
