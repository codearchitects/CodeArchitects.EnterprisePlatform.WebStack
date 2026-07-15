import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild, inject } from '@angular/core';
import * as _ from 'lodash-es';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { yieldFunc } from '../../utilities/common.utility';
import { FormDesignerControl } from '../../decorators';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';
import { KeyCode } from '../../utilities/key-code.const';
import { scrollTo } from '../../utilities/scrollable.utility';
import { ILookupMulti, IShBaseLookupMultiOptions, ShBaseLookupMultiComponent } from './../base/index';
import { CAEP_MULTISELECT_CARETS_ICON_TOKEN } from './tokens/multiselect-carets-icon.token';
import { CAEP_MULTISELECT_CARETS_FILL_ICON_TOKEN } from './tokens/multiselect-carets-fill-icon.token';
import { isNoU } from '../../utilities/common.utility';

/**
 * Base multiselect component options contract
 */
export interface IShMultiSelectOptions<T, V>
  extends IShBaseLookupMultiOptions<T, V> {
  /**
   * Dropdown width
   */
  dropdownWidth?: string;
  /**
   * Dropdown height
   */
  dropdownHeight?: string;
  /**
   * Dropdown toggler subject
   */
  toggleDropdown$?: Subject<boolean>;
  /** 
   * Carets icon name for multiselect opening
  */
  caretsIcon?: string;
  /** 
   * Carets fill icon name for multiselect closing
  */
  caretsFillIcon?: string;
}

@FormDesignerControl({
  name: 'multiselect',
  shortDescription: 'MultiSelect Control'
})
@Component({
    selector: 'sh-multiselect',
    templateUrl: './multiselect.component.html',
    styleUrls: ['./multiselect.component.scss'],
    changeDetection: shChangeDetectorStrategy(),
    standalone: false
})
/**
 * Base multiselect component
 */
export class ShMultiSelectComponent<T, V, O extends IShMultiSelectOptions<T, V>>
  extends ShBaseLookupMultiComponent<T, V, O> implements OnInit, AfterViewInit {
  /**
   * Indicates if dropdown menu is shown
   */
  /*protected*/ public isOpened = false;
  /**
   * Index of the active (focused by keyboard) result
   */
  /*protected*/ public activeResultIndex = 0;
  /**
   * DebounceTime of keydown event
   */
  /*protected*/ public keyDownDebounceTime = 0;
  /**
   * Accumulated characters for first-character type-ahead
   */
  /*protected*/ public typeaheadBuffer = '';
  /**
   * Timer that resets the type-ahead buffer
   */
  private _typeaheadTimeout: ReturnType<typeof setTimeout>;
  /**
   * List of dropdown results (pure html elements)
   */
  @ViewChild('results')
  /*protected*/ public set results(listRef: ElementRef) {
    if (listRef) {
      const list = listRef.nativeElement as HTMLUListElement;
      this._results = list.children;
    }
  }
  /**
   * References to control HTML element
   */
  @ViewChild('input')
  /*protected*/ public controlRef: ElementRef;
  /**
   * Results html collection
   */
  /*protected*/ public _results: HTMLCollection;
  /**
   * Dropdown width
   */
  /*protected*/ public get dropdownWidth() {
    let width = 'auto';
    const input: HTMLDivElement = this._input && this._input.nativeElement;
    if (this.internalOptions.dropdownWidth) {
      width = this.internalOptions.dropdownWidth;
    } else if (input) {
      width = `${input.clientWidth}px`;
    }
    return width;
  }
  /**
   * References to component element
   */
  /*protected*/ public element: ElementRef;
  /**
   * Carets icon name registered by token
   */
  protected commonCaretsIcon: string = inject(CAEP_MULTISELECT_CARETS_ICON_TOKEN, { optional: true });
  /**
   * Carets fill icon name registered by token
   */
  protected commonCaretsFillIcon: string = inject(CAEP_MULTISELECT_CARETS_FILL_ICON_TOKEN, { optional: true });
  /**
   * The element reference to dropdown menu
   */
  @ViewChild('dropdown')
  private _dropdown: ElementRef;
  /**
   * References to input element
   */
  @ViewChild('input')
  private _input: ElementRef;

  /**
   * Base multiselect component
   */
  constructor(
    injector: Injector
  ) {
    super(injector);
    this.element = injector.get(ElementRef);
  }

  public ngOnInit() {
    super.ngOnInit();
    if (isNoU(this.options.caretsIcon) && !isNoU(this.commonCaretsIcon)) {
      this.internalOptions.caretsIcon = this.commonCaretsIcon;
    }
    if (isNoU(this.options.caretsFillIcon) && !isNoU(this.commonCaretsFillIcon)) {
      this.internalOptions.caretsFillIcon = this.commonCaretsFillIcon;
    }
  }

  public ngAfterViewInit() {
    const event$ = fromEvent(this.element.nativeElement, 'keydown');
    if (this.keyDownDebounceTime) {
      event$.pipe(debounceTime(this.keyDownDebounceTime));
    }
    event$.pipe(takeUntil(this.destroy$)).subscribe(this.onKey.bind(this));
    this.internalOptions.toggleDropdown$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.isOpened = !this.isOpened);
    // A11y: warn (dev only) if the combobox would have no programmatic name.
    if (!this.ariaLabel && !this.ariaLabelledBy && !this.placeholder) {
      console.warn(
        `sh-multiselect (${this.internalOptions.id}): no accessible name. `
        + `Provide an aria-label, aria-labelledby or a placeholder.`
      );
    }
  }

  /*protected*/ public getDefaultOptions(): IShMultiSelectOptions<T, V> {
    return _.merge(super.getDefaultOptions(), {
      dropdownHeight: '150px',
      toggleDropdown$: new Subject<boolean>(),
      caretsIcon: 'icon icon-multiselect-off',
      caretsFillIcon: 'icon icon-multiselect-on'
    });
  }

  /**
   * Fired when a key is pressed
   * @param e The keyboard event
   */
  /*protected*/ public onKey(e: KeyboardEvent) {
    if (this.values && this.enable && !this.internalOptions.isReadonly) {
      let prevent = false;
      const keyCode = e.keyCode || e.which;
      const value = this.getControlValue();
      const currentIndex = _.findIndex(this.values, v => this.internalOptions.equalityFunc(value, v.ref));
      switch (keyCode) {
        case KeyCode.ARROW_UP:
          this.toggleResult(this.isOpened ? this.activeResultIndex : currentIndex, false);
          prevent = true;
          break;
        case KeyCode.ARROW_DOWN:
          this.toggleResult(this.isOpened ? this.activeResultIndex : currentIndex, true);
          prevent = true;
          break;
        case KeyCode.ENTER:
          if (this.isOpened) {
            const v = this.values[this.activeResultIndex];
            if (v) {
              this.onSelectValue(v);
            }
          } else {
            // APG: Enter opens the popup when it is closed.
            this.isOpened = true;
            prevent = true;
          }
          break;
        case KeyCode.HOME:
          if (this.isOpened && this.values.length) {
            this.activateResult(0, false);
            prevent = true;
          }
          break;
        case KeyCode.END:
          if (this.isOpened && this.values.length) {
            this.activateResult(this.values.length - 1, true);
            prevent = true;
          }
          break;
        case KeyCode.ESC:
        case KeyCode.TAB:
          this.isOpened = false;
          break;
        default:
          // APG: first-character type-ahead while the listbox is open.
          if (this.isOpened && e.key && e.key.length === 1 && /\S/.test(e.key)) {
            this.onTypeahead(e.key);
          }
          break;
      }
      if (prevent) {
        e.preventDefault();
      }
    }
  }

  /**
   * Keyboard handler bound to the combobox trigger element.
   * Provides a keyboard equivalent to the mouse toggle: Space opens the
   * listbox when closed and toggles the active option when already open,
   * keeping the popup open (multi-select). Enter/Arrow keys are handled by
   * {@link onKey}. Does nothing when disabled or read-only.
   * @param e The keyboard event
   */
  /*protected*/ public onTriggerKeydown(e: KeyboardEvent) {
    if (!this.enable || this.internalOptions.isReadonly) {
      return;
    }
    const keyCode = e.keyCode || e.which;
    if (keyCode === KeyCode.SPACE) {
      if (this.isOpened) {
        const v = this.values && this.values[this.activeResultIndex];
        if (v) {
          this.onSelectValue(v);
        }
      } else {
        this.isOpened = true;
      }
      e.preventDefault();
    }
  }

  /**
   * Event fired when enter keyboard key is tapped or
   * item is selected with mouse click from dropdown
   */
  /*protected*/ public onSelectValue(value: ILookupMulti<V>) {
    value.formControl.setValue(!value.formControl.value);
    this.markAsDirty();
  }

  /**
   * Toggles dropdown menu visibility and focus on specified result's index
   * @param index Index of current result
   * @param next Checks if it must move to next or previous result
   * @param apply Checks if it can update control value
   */
  /*protected*/ public toggleResult(index: number, next = true) {
    if (!this.internalOptions.isReadonly) {
      this.isOpened = true;
      if (index > -1) {
        const count = this.values.length - 1;
        if (next) {
          index = index === count ? 0 : index + 1;
        } else {
          index = index === 0 ? count : index - 1;
        }
        this.activeResultIndex = index;
        yieldFunc(() => {
          scrollTo(this._dropdown?.nativeElement, this._results, index, next);
        });
      } else {
        this.toggleResult(0, next);
      }
    }
  }

  /**
   * Moves the active option to an absolute index, opening the popup and
   * scrolling the option into view. Backs the Home/End keys and type-ahead.
   * Keeps aria-activedescendant in sync with the highlighted option.
   * @param index Absolute index of the option to activate
   * @param next Scroll direction hint
   */
  /*protected*/ public activateResult(index: number, next = true) {
    if (this.internalOptions.isReadonly || !this.values || index < 0 || index >= this.values.length) {
      return;
    }
    this.isOpened = true;
    this.activeResultIndex = index;
    yieldFunc(() => {
      scrollTo(this._dropdown?.nativeElement, this._results, index, next);
    });
  }

  /**
   * First-character type-ahead. Appends the typed character to a short-lived
   * buffer and moves the active option to the first option whose label starts
   * with the buffer, wrapping around the list. The buffer is cleared after a
   * brief pause so consecutive keystrokes match progressively longer prefixes.
   * @param char The printable character that was typed
   */
  /*protected*/ public onTypeahead(char: string) {
    if (!this.values || !this.values.length) {
      return;
    }
    if (this._typeaheadTimeout) {
      clearTimeout(this._typeaheadTimeout);
    }
    this.typeaheadBuffer += char.toLowerCase();
    this._typeaheadTimeout = setTimeout(() => (this.typeaheadBuffer = ''), 500);
    const count = this.values.length;
    // On the first character start searching after the current option so
    // repeated presses cycle; while extending the buffer keep the current one.
    const start = this.typeaheadBuffer.length > 1
      ? this.activeResultIndex
      : this.activeResultIndex + 1;
    for (let offset = 0; offset < count; offset++) {
      const idx = (((start + offset) % count) + count) % count;
      const label = String(this.values[idx].label || '').toLowerCase();
      if (label.startsWith(this.typeaheadBuffer)) {
        this.activateResult(idx, idx >= this.activeResultIndex);
        break;
      }
    }
  }
}
