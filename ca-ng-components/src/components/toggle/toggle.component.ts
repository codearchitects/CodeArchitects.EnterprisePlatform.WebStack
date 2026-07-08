import { Component, Injector } from '@angular/core';
import { FormDesignerControl } from '../../decorators';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';
import { IN } from '../../utilities/common.utility';
import { KeyCode } from "../../utilities/key-code.const";
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
    changeDetection: shChangeDetectorStrategy(),
    standalone: false
})
/**
 * Toggle component
 */
export class ShToggleComponent extends ShBaseInputComponent<boolean, IShBaseInputOptions<boolean>> {
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
