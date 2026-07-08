import { Component, Injector } from '@angular/core';
import { FormDesignerControl } from '../../decorators';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';
import { IN } from '../../utilities/common.utility';
import { KeyCode } from '../../utilities/key-code.const';
import { ILookupSingle, IShBaseLookupSingleOptions, ShBaseLookupSingleComponent } from '../base/index';

/**
 * Base Radio Component options contract
 */
export interface IShRadioOptions<T, V> extends IShBaseLookupSingleOptions<T, V> {
  /**
   * Specifies if group must be inline
   */
  isInline?: boolean;
}

@FormDesignerControl({
  name: 'radio',
  shortDescription: 'Radio Control'
})
@Component({
    selector: 'sh-radio',
    templateUrl: './radio.component.html',
    styleUrls: ['./radio.component.scss'],
    changeDetection: shChangeDetectorStrategy(),
    standalone: false
})
/**
 * Base Radio Component
 */
export class ShRadioComponent<T, V>
  extends ShBaseLookupSingleComponent<T, V, IShRadioOptions<T, V>> {
  /**
   * Radio group identifier
   */
  /*protected*/ public groupName: string;

  /**
   * Base Radio Component
   */
  constructor(injector: Injector) {
    super(injector);
    this.groupName = this.idSequence.next();
  }

  /**
   * Event fired on key
   * @param id Value identifier
   * @param e Keyboard event
   */
  /*protected*/ public onKey(e: KeyboardEvent) {
    if (!this.internalOptions.isReadonly && this.enable !== false) {
      const keycode = e.keyCode || e.which;
      if (IN(keycode, KeyCode.ARROW_DOWN, KeyCode.ARROW_UP, KeyCode.ARROW_LEFT, KeyCode.ARROW_RIGHT)) {
        this.next(keycode === KeyCode.ARROW_DOWN || keycode === KeyCode.ARROW_RIGHT);
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }

  /**
   * Toggles control value
   * @param id Identifier of value to toggle
   */
  /*protected*/ public toggle(value: ILookupSingle<V>) {
    if (!this.internalOptions.isReadonly && this.enable !== false){
      this.setControlValue(value.ref);
      this.touch();
      this.markAsDirty();
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

  /**
   * Moves to next/prev value
   * @param next If true, moves to next value
   */
  private next(next = true) {
    const currentValue = this.getControlValue();
    if (currentValue) {
      let newIndex = 0;
      const currentIndex = this.values.findIndex(v => this.internalOptions.equalityFunc(currentValue, v.ref));
      if (next) {
        if (currentIndex < this.values.length - 1) {
          newIndex = currentIndex + 1;
        }
      } else {
        if (currentIndex > 0) {
          newIndex = currentIndex - 1;
        } else {
          newIndex = this.values.length - 1;
        }
      }
      if (newIndex > -1) {
        this.toggle(this.values[newIndex]);
      }
    }
  }

}
