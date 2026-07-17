import { AfterViewInit, Component, ElementRef, Injector, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FormDesignerControl } from 'src/decorators';
import { SH_CHANGE_DETECTOR } from 'src/environments/change-detection-strategy';
import { KeyCode } from '../../utilities/key-code.const';
import { scrollTo } from '../../utilities/scrollable.utility';
import { IShBaseLookupSingleOptions, ShBaseLookupSingleComponent } from './../base/base-lookup-single.component';

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
}

@FormDesignerControl({
  name: 'select',
  shortDescription: 'Select Control'
})
@Component({
  selector: 'sh-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: SH_CHANGE_DETECTOR.STRATEGY
})
/**
 * Base select component
 */
export class ShSelectComponent<T, V, O extends IShSelectOptions<T, V>>
  extends ShBaseLookupSingleComponent<T, V, O> implements AfterViewInit {
  /**
   * Indicates if dropdown menu is shown
   */
  protected isOpened = false;
  /**
   * Index of the active (focused by keyboard) result
   */
  protected activeResultIndex = 0;
  /**
   * DebounceTime of keydown event
   */
  protected keyDownDebounceTime = 0;
  /**
   * List of dropdown results (pure html elements)
   */
  @ViewChild('results', { static: false })
  protected set results(listRef: ElementRef) {
    if (listRef) {
      const list = listRef.nativeElement as HTMLUListElement;
      this._results = list.children;
    }
  }
  /**
   * Results html collection
   */
  protected _results: HTMLCollection;
  /**
   * Dropdown width
   */
  protected get dropdownWidth() {
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
  protected element: ElementRef;
  /**
   * Event fired when dropdown toggles
   */
  protected onDropdownToggled: () => void;
  /**
   * References to control HTML element
   */
  @ViewChild('input', { static: false })
  protected controlRef: ElementRef;
  /**
   * The element reference to dropdown menu
   */
  @ViewChild('dropdown', { static: false })
  private _dropdown: ElementRef;
  /**
   * References to input element
   */
  @ViewChild('input', { static: false })
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

  public ngAfterViewInit() {
    const event$ = fromEvent(this.element.nativeElement, 'keydown');
    if (this.keyDownDebounceTime) {
      event$.pipe(debounceTime(this.keyDownDebounceTime));
    }
    event$.pipe(takeUntil(this.destroy$));
    event$.subscribe(this.onKey.bind(this));
    this.internalOptions.toggleDropdown$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.isOpened = !this.isOpened);
  }

  protected getDefaultOptions(): IShSelectOptions<T, V> {
    return _.merge(super.getDefaultOptions(), {
      dropdownHeight: '150px',
      toggleDropdown$: new Subject()
    });
  }

  /**
   * Fired when a key is pressed
   * @param e The keyboard event
   */
  protected onKey(e: KeyboardEvent) {
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
   * Event fired when enter keyboard key is tapped or
   * item is selected with mouse click from dropdown
   */
  protected onSelectValue(value: V) {
    this.setControlValue(value);
    this.markAsDirty();
    this.isOpened = false;
  }

  /**
   * Event fired when delete/backspace keyboard key is tapped
   */
  protected onDelete() {
    this.setControlValue(undefined);
  }

  /**
   * Toggles dropdown menu visibility and focus on specified result's index
   * @param toggle Checks if it wants to show menu
   * @param index Index of current result
   * @param next Checks if it must move to next or previous result
   */
  protected toggleResults(toggle: boolean, index: number, next = false) {
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
  protected toggleResult(index: number, next = true, apply = false) {
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
