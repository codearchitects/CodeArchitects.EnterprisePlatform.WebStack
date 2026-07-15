import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash-es';
import { Observable, Subject, lastValueFrom } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FormDesignerControl } from '../../decorators';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';
import { isNoU } from '../../utilities/common.utility';
import { KeyCode, keyIsLetter, keyIsNumber } from '../../utilities/key-code.const';
import { IShSelectOptions, ShSelectComponent } from './../select/select.component';

/**
 * Base Combo Component options contract
 */
export interface IShComboOptions<T>
  extends IShSelectOptions<T, T> {
  /**
   * Retrieves data from the source Observable only after a particular time span
   * has passed without another source emission
   */
  debounceTime?: number;
  /**
   * Specifies whether the text inserted into input must appear as a list result
   */
  showTextAsResult?: boolean;
  /**
   * Minimum number of chars required to start search
   * @default 3
   */
  minChars?: number;
  /**
   * Event fired when user tap ENTER on input field or
   * when clicks to text list item.
   * It works just when showTextAsResult is true
   * @param text Input text
   */
  onSelectText?(text: string): T | void;
  /**
   * Callback which must return a source based
   * on a string
   * @param text Filter text
   */
  onGetData?(text: string): Promise<T[]>;
}


@FormDesignerControl({
  name: 'combo',
  shortDescription: 'Combo Control'
})
@Component({
    selector: 'sh-combo',
    templateUrl: './combo.component.html',
    styleUrls: ['./combo.component.scss'],
    changeDetection: shChangeDetectorStrategy(),
    standalone: false
})
/**
 * Base Combo Component
 */
export class ShComboComponent<T, TOptions extends IShComboOptions<T> = IShComboOptions<T>>
  extends ShSelectComponent<T, T, TOptions> implements OnInit {
  /**
   * References to control HTML element
   */
  @ViewChild('input')
  /*protected*/ public controlRef: ElementRef;
  /**
   * Control text value
   */
  /*protected*/ public text: string;
  /**
   * Translate service
   */
  private _translateService: TranslateService;
  /**
   * Get Data subject
   */
  private _getData$ = new Subject<void>();

  /**
   * Id of the currently active option (`aria-activedescendant`) while the
   * listbox is open, or `null` when there is no active option / the popup is
   * closed. Keeps DOM focus on the input per the APG editable combobox
   * pattern. (WCAG 4.1.2)
   */
  public get activeDescendantId(): string | null {
    if (!this.isOpened || this.internalOptions.isReadonly) {
      return null;
    }
    const hasValues = !!(this.values && this.values.length);
    if (this.activeResultIndex === -1) {
      return (this.internalOptions.showTextAsResult && this.text && !hasValues)
        ? this.id + '-opt-text'
        : null;
    }
    return (hasValues && this.activeResultIndex < this.values.length)
      ? this.id + '-opt-' + this.activeResultIndex
      : null;
  }

  /**
   * Base Combo Component
   */
  constructor(injector: Injector) {
    super(injector);
    this._translateService = injector.get(TranslateService);
    this.keyDownDebounceTime = 10;
    this.onModelValueChanges =  (_, value) => {
      this._updateText(value);
    };
  }

  public async ngOnInit() {
    super.ngOnInit();
    if (this.internalOptions.showTextAsResult) {
      this.activeResultIndex = -1;
      this.onDropdownToggled = () => this.activeResultIndex = -1;
      const value = this.model ? this.getModelValue() : this.getControlValue();
      if (this.values && this.values.findIndex((v) => value === v.ref) === -1 && typeof value === 'string') {
        this.text = value;
        await this.onSelectText(value);
      }
    }
    if (this.model) {
      await this.onModelValueChanges(this.getControlValue(), this.getModelValue());
    } else {
      this._updateText(this.getControlValue());
    }
    this._getData$
      .pipe(debounceTime(this.internalOptions.debounceTime), takeUntil(this.destroy$))
      .subscribe(async () => {
        if (!isNoU(this.text) && this.text.length >= this.internalOptions.minChars) {
          await this.getData();
        } else {
          this.setValues([]);
        }
      });
  }

  /**
   * Fired when a key is pressed
   * @param e The keyboard event
   */
  /*protected*/ public onKey(e: KeyboardEvent) {
    const keyCode = e.keyCode || e.which;
    if (this.internalOptions.showTextAsResult
      && keyCode === KeyCode.ENTER
      && this.activeResultIndex === -1) {
      this.onSelectText(this.text);
    } else if (this.values) {
      if (keyIsLetter(keyCode) || keyIsNumber(keyCode)) {
        this._getData$.next();
      } else {
        super.onKey(e);
      }
    }
  }

  /*protected*/ public onDelete() {
    this._getData$.next();
    super.onDelete();
  }

  /*protected*/ public onSelectValue(value: T) {
    this.setControlValue(value);
    this.formControl.markAsDirty();
    this.translate(value).then(text => {
      this.text = text;
      this.isOpened = false;
    });
  }

  public onControlValueChanges(): void {
    super.onControlValueChanges();
    if (!this.isOpened) {
      this._updateText(this.getControlValue());
    }
  }

  private _updateText(value: T) {
    if (!isNoU(value)) {
      this.translate(value).then(text => this.text = text);
    } else {
      this.text = undefined;
      this.onDelete();
    }
  }

  /**
   * Event fired when user tap ENTER on input field or
   * when clicks to text list item.
   * It works just when showTextAsResult is true
   * @param text Input text
   */
  /*protected*/ public onSelectText(text: string) {
    this.setControlValue(this.internalOptions.onSelectText(text));
    this.isOpened = false;
  }

  /*protected*/ public toggleResult(index: number, next = true, apply = false) {
    if (this.internalOptions.showTextAsResult && !apply) {
      const count = this.values.length - 1;
      if (index === -1) {
        this.activeResultIndex = next ? 0 : count;
      } else if (index === count) {
        this.activeResultIndex = next ? -1 : count - 1;
      } else if (index === 0 && !next) {
        this.activeResultIndex = -1;
      } else {
        super.toggleResult(index, next, apply);
      }
    } else {
      super.toggleResult(index, next, apply);
    }
  }

  /**
   * Event fired when user click outside
   */
  /*protected*/ public onClickOutside() {
    this.isOpened = false;
    if (this.internalOptions.showTextAsResult && this.text && !this.values.length) {
      this.onSelectText(this.text);
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

  /*protected*/ public getDefaultOptions(): IShComboOptions<T> {
    return _.merge(super.getDefaultOptions(), {
      minChars: 3,
      debounceTime: 500,
      source: [],
      onSelectText: (text: string) => text as any
    });
  }

  /**
   * Retrieves data to show as datasource
   */
  private async getData() {
    let data: T[];
    if (this.internalOptions.onGetData) {
      data = await this.internalOptions.onGetData(this.text);
    } else {
      const values = this.internalOptions.values;
      if (values instanceof Array) {
        data = await this.filterAsync(values);
      } else if (values instanceof Observable) {
        data = await this.filterAsync(this.values.map(v => v.ref));
      }
    }
    data = data || [];
    this.setValues(data);
    this.isOpened = !!data.length || this.internalOptions.showTextAsResult;
    if (this.onDropdownToggled) {
      this.onDropdownToggled();
    }
    const translatedValue = await this.translate(this.getControlValue());
    if (this.text !== translatedValue) {
      this.setControlValue(undefined);
    }
  }

  /**
   * Filters static datasource by text
   * @param values
   */
  private async filterAsync(values: T[]) {
    const retval: T[] = [];
    for (let index = 0; index < values.length; index++) {
      const value = values[index];
      const translatedValue = await this.translate(value);
      if (translatedValue.toLowerCase().indexOf(this.text.toLowerCase()) > -1) {
        retval.push(value);
      }
    }
    return retval;
  }

  /**
   * Pipes and translates control value
   * @param value The value to be translated
   */
  private async translate(value: T) {
    let controlValue: string;
    if (this.internalOptions.valuesPipe) {
      if (this.internalOptions.valuesPipeArgs) {
        controlValue = this.internalOptions.valuesPipe.transform(value, ...this.internalOptions.valuesPipeArgs);
      } else {
        controlValue = this.internalOptions.valuesPipe.transform(value);
      }
    } else {
      controlValue = (<any>value) as string;
    }
    if (controlValue) {
      controlValue = await lastValueFrom(this._translateService.get(controlValue));
    }
    return controlValue;
  }

}
