import { Component, Injector } from '@angular/core';
import { FormDesignerControl } from 'src/decorators';
import { SH_CHANGE_DETECTOR } from 'src/environments/change-detection-strategy';
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
  changeDetection: SH_CHANGE_DETECTOR.STRATEGY
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
  protected onKey(id: string, e: KeyboardEvent) {
    if (this.enable && !this.internalOptions.isReadonly) {
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
  protected toggle(id: string) {
    if (this.enable && !this.internalOptions.isReadonly) {
      const value = this.values.find(v => v.id === id);
      if (value) {
        const formControl = value.formControl;
        const oldValue = formControl.value;
        formControl.setValue(!oldValue);
      }
    }
  }

}
