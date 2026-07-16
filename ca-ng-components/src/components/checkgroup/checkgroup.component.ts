import { Component, Injector } from '@angular/core';
import { FormDesignerControl } from '../../decorators';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';
import { IN } from '../../utilities/common.utility';
import { KeyCode } from '../../utilities/key-code.const';
import { IShBaseLookupMultiOptions, ShBaseLookupMultiComponent } from '../base/base-lookup-multi.component';

/**
 * Base Checkgroup Component options contract
 */
export interface IShCheckGroupOptions<T, V>
  extends IShBaseLookupMultiOptions<T, V> {
  /**
   * Specifies if group must be inline
   */
  isInline?: boolean;
}

@FormDesignerControl({
  name: 'checkgroup',
  shortDescription: 'Checkgroup Control'
})
@Component({
    selector: 'sh-checkgroup',
    templateUrl: './checkgroup.component.html',
    styleUrls: ['../checkbox/checkbox.component.scss', './checkgroup.component.scss'],
    changeDetection: shChangeDetectorStrategy(),
    standalone: false
})
/**
 * Base Checkgroup Component
 */
export class ShCheckgroupComponent<T, V>
  extends ShBaseLookupMultiComponent<T, V, IShCheckGroupOptions<T, V>> {

  /**
   * Base Checkgroup Component
   */
  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * Event fired on key
   * @param id Value identifier
   * @param e Keyboard event
   */
  /*protected*/ public onKey(id: string, e: KeyboardEvent) {
    if (!this.internalOptions.isReadonly && this.enable !== false && !this.formControl.disabled) {
      const keycode = e.keyCode || e.which;
      if (IN(keycode, KeyCode.ENTER, KeyCode.SPACE)) {
        this.toggle(id);
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }

  /**
   * Toggles control value
   * @param id Identifier of value to toggle
   */
  /*protected*/ public toggle(id: string) {
    if (!this.internalOptions.isReadonly && this.enable !== false && !this.formControl.disabled) {
      const value = this.values.find(v => v.id === id);
      if (value) {
        const formControl = value.formControl;
        const oldValue = formControl.value;
        formControl.setValue(!oldValue);
        this.touch();
        this.formControl.markAsDirty();
      }
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
