import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild, inject } from '@angular/core';
import * as _ from 'lodash-es';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FormDesignerControl } from '../../decorators';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';
import { KeyCode } from '../../utilities/key-code.const';
import { scrollTo } from '../../utilities/scrollable.utility';
import { IShBaseLookupSingleOptions, ShBaseLookupSingleComponent } from './../base/base-lookup-single.component';
import { CAEP_SELECT_CARET_UP_ICON_TOKEN } from './tokens/select-caret-up-icon.token';
import { CAEP_SELECT_CARET_DOWN_ICON_TOKEN } from './tokens/select-caret-down-icon.token';
import { isNoU } from '../../utilities/common.utility';

/**
 * Base select component options contract
 */
export interface IShSelectOptions<T, V>
  extends IShBaseLookupSingleOptions<T, V> {
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
   * Caret up icon name for select closing
  */
  caretUpIcon?: string;
  /** 
   * Caret down icon name for select opening
  */
  caretDownIcon?: string;
}

@FormDesignerControl({
  name: 'select',
  shortDescription: 'Select Control'
})
@Component({
    selector: 'sh-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    changeDetection: shChangeDetectorStrategy(),
    standalone: false
})
/**
 * Base select component
 */
export class ShSelectComponent<T, V, O extends IShSelectOptions<T, V>>
  extends ShBaseLookupSingleComponent<T, V, O> implements OnInit, AfterViewInit {
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
   * Event fired when dropdown toggles
   */
  /*protected*/ public onDropdownToggled: () => void;
  /**
   * References to control HTML element
   */
  @ViewChild('input')
  /*protected*/ public controlRef: ElementRef;
  /**
   * Caret up icon name registered by token
   */
  protected commonCaretUpIcon: string = inject(CAEP_SELECT_CARET_UP_ICON_TOKEN, { optional: true });
  /**
   * Caret down icon name registered by token
   */
  protected commonCaretDownIcon: string = inject(CAEP_SELECT_CARET_DOWN_ICON_TOKEN, { optional: true });
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
   * Base select component
   */
  constructor(
    injector: Injector
  ) {
    super(injector);
    this.element = injector.get(ElementRef);
  }

  public ngOnInit() {
    super.ngOnInit();
    if (isNoU(this.options.caretUpIcon) && !isNoU(this.commonCaretUpIcon)) {
      this.internalOptions.caretUpIcon = this.commonCaretUpIcon;
    }
    if (isNoU(this.options.caretDownIcon) && !isNoU(this.commonCaretDownIcon)) {
      this.internalOptions.caretDownIcon = this.commonCaretDownIcon;
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
  }

  /*protected*/ public getDefaultOptions(): IShSelectOptions<T, V> {
    return _.merge(super.getDefaultOptions(), {
      dropdownHeight: '150px',
      toggleDropdown$:  new Subject<boolean>(),
      caretUpIcon: 'icon icon-select-on',
      caretDownIcon: 'icon icon-select-off'
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
          this.toggleResults(e.altKey, this.isOpened ? this.activeResultIndex : currentIndex);
          prevent = true;
          break;
        case KeyCode.ARROW_DOWN:
          this.toggleResults(e.altKey, this.isOpened ? this.activeResultIndex : currentIndex, true);
          prevent = true;
          break;
        case KeyCode.ENTER:
          if (this.isOpened) {
            const v = this.values[this.activeResultIndex];
            if (v) {
              this.onSelectValue(v.ref);
            }
          }
          break;
        case KeyCode.DELETE:
        case KeyCode.BACKSPACE:
          this.onDelete();
          break;
        case KeyCode.ESC:
        case KeyCode.TAB:
          this.isOpened = false;
          break;
        default:
          break;
      }
      if (prevent) {
        e.preventDefault();
      }
    }
  }

  /**
   * Keyboard handler bound on the combobox box itself. Complements the
   * element-level {@link onKey} listener (which already covers Arrow keys,
   * Enter, Escape and Delete/Backspace) by adding the APG combobox keys that
   * were missing: Home/End jump to first/last option and Space toggles the
   * dropdown open/closed. Focus stays on the combobox (active-descendant
   * model); nothing here changes the committed value except through the
   * existing methods.
   * @param e The keyboard event
   */
  /*protected*/ public onComboboxKeydown(e: KeyboardEvent) {
    if (!(this.values && this.enable && !this.internalOptions.isReadonly)) {
      return;
    }
    const lastIndex = this.values.length - 1;
    switch (e.key) {
      case 'Home':
        this.isOpened = true;
        this.setActiveResult(0);
        e.preventDefault();
        break;
      case 'End':
        this.isOpened = true;
        this.setActiveResult(lastIndex);
        e.preventDefault();
        break;
      case ' ':
      case 'Spacebar':
        this.isOpened = !this.isOpened;
        e.preventDefault();
        break;
      default:
        break;
    }
  }

  /**
   * Moves the active-descendant marker to the given option index (clamped to
   * the available range) and scrolls it into view when the dropdown is
   * rendered. Does not commit the value.
   * @param index Target option index
   */
  /*protected*/ public setActiveResult(index: number) {
    if (!this.values || !this.values.length) {
      return;
    }
    this.activeResultIndex = Math.max(0, Math.min(index, this.values.length - 1));
    if (this._dropdown && this._results) {
      scrollTo(this._dropdown.nativeElement, this._results, this.activeResultIndex, true);
    }
  }

  /**
   * Event fired when enter keyboard key is tapped or
   * item is selected with mouse click from dropdown
   */
  /*protected*/ public onSelectValue(value: V) {
    this.setControlValue(value);
    this.markAsDirty();
    this.isOpened = false;
  }

  /**
   * Event fired when delete/backspace keyboard key is tapped
   */
  /*protected*/ public onDelete() {
    this.setControlValue(undefined);
  }

  /**
   * Toggles dropdown menu visibility and focus on specified result's index
   * @param toggle Checks if it wants to show menu
   * @param index Index of current result
   * @param next Checks if it must move to next or previous result
   */
  /*protected*/ public toggleResults(toggle: boolean, index: number, next = false) {
    if (!this.internalOptions.isReadonly) {
      if (toggle) {
        this.isOpened = true;
        if (this.onDropdownToggled) {
          this.onDropdownToggled();
        }
      } else {
        this.toggleResult(index, next, !this.isOpened);
      }
    }
  }

  /**
   * Toggles dropdown menu visibility and focus on specified result's index
   * @param index Index of current result
   * @param next Checks if it must move to next or previous result
   * @param apply Checks if it can update control value
   */
  /*protected*/ public toggleResult(index: number, next = true, apply = false) {
    if (index > -1) {
      const count = this.values.length - 1;
      if (next) {
        index = index === count ? 0 : index + 1;
      } else {
        index = index === 0 ? count : index - 1;
      }
      if (apply) {
        const value = this.values[index];
        if (value) {
          this.setControlValue(value.ref);
        }
      } else {
        this.activeResultIndex = index;
        scrollTo(this._dropdown.nativeElement, this._results, index, next);
      }
    } else {
      this.toggleResult(0, next, apply);
    }
  }

}
