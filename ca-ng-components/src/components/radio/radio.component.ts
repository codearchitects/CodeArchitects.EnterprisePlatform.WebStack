import { Component, ElementRef, Injector, QueryList, ViewChildren } from '@angular/core';
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
   * References to the focusable `role="radio"` elements, in `values` order.
   * Used to move DOM focus for the roving-tabindex APG radio-group pattern.
   */
  @ViewChildren('radioOpt') public radioOpts!: QueryList<ElementRef<HTMLElement>>;

  /**
   * Index of the option that owns the roving `tabindex="0"`. The checked
   * option is tabbable; when nothing is checked the first option is, per APG.
   */
  public get focusableIndex(): number {
    if (!this.values || this.values.length === 0) {
      return -1;
    }
    const idx = this.values.findIndex(v => this.internalOptions.equalityFunc(this.formControl?.value, v.ref));
    return idx > -1 ? idx : 0;
  }

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
   * Event fired on key on a single `role="radio"` option. Space selects the
   * focused option (APG). Arrow keys are intentionally left to bubble to the
   * group-level {@link onKey} handler so their behaviour is not duplicated.
   * @param e Keyboard event
   * @param value The option the event originated from
   */
  /*protected*/ public onOptionKey(e: KeyboardEvent, value: ILookupSingle<V>) {
    if (!this.internalOptions.isReadonly && this.enable !== false) {
      const keycode = e.keyCode || e.which;
      if (IN(keycode, KeyCode.SPACE)) {
        this.toggle(value);
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }

  /**
   * Moves DOM focus to the `role="radio"` option at the given index, keeping
   * focus with the selected option as required by the roving-tabindex pattern.
   * @param index Index of the option in {@link values}
   */
  private focusOption(index: number) {
    const el = this.radioOpts?.toArray()[index]?.nativeElement;
    if (el) {
      el.focus();
    }
  }

  /**
   * Index of the `role="radio"` option that currently owns DOM focus, or `-1`
   * when focus is not on any option. Used to anchor arrow-key navigation on the
   * FOCUSED option (APG roving-tabindex) rather than on the selected value, so
   * arrows work even when nothing is selected or the selected ref is falsy.
   */
  private getFocusedOptionIndex(): number {
    const active = typeof document !== 'undefined' ? document.activeElement : null;
    if (!active) {
      return -1;
    }
    const arr = this.radioOpts?.toArray() ?? [];
    return arr.findIndex(ref => ref?.nativeElement === active);
  }

  /**
   * Provides a programmatic accessible name for an option that has no visible
   * label (its `aria-labelledby` target is absent), falling back to the option
   * ref and then its id so every `role="radio"` always exposes a name.
   * @param value The option
   * @return An aria-label string, or `null` when the option already has a
   * label-based name (so the attribute is not rendered).
   */
  /*protected*/ public optionAriaLabel(value: ILookupSingle<V>): string | null {
    if (value?.label) {
      return null;
    }
    const ref = value?.ref;
    if (ref !== null && ref !== undefined && `${ref}`.length > 0) {
      return `${ref}`;
    }
    return value?.id ?? null;
  }

  /**
   * Toggles control value
   * @param id Identifier of value to toggle
   */
  /*protected*/ public toggle(value: ILookupSingle<V>) {
    if (!this.internalOptions.isReadonly && this.enable !== false) {
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
   * Moves focus and selection to the next/previous option, per the APG radio
   * group pattern (arrow keys move AND select, with wrap-around). The anchor is
   * the currently FOCUSED option (or, when focus is not on an option, the
   * roving-tabindex option) — never the selected value — so navigation always
   * works even when nothing is selected or the selected ref is falsy.
   * @param next If true, moves to next value
   */
  private next(next = true) {
    if (!this.values || this.values.length === 0) {
      return;
    }
    const len = this.values.length;
    let currentIndex = this.getFocusedOptionIndex();
    if (currentIndex < 0) {
      // Fall back to the roving-tabindex option (checked, or first when none).
      currentIndex = this.focusableIndex;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    }
    let newIndex: number;
    if (next) {
      newIndex = currentIndex < len - 1 ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : len - 1;
    }
    this.toggle(this.values[newIndex]);
    this.focusOption(newIndex);
  }

}
