import { isNoU } from '../../utilities/common.utility';
import { takeUntil } from 'rxjs/operators';
import { PipeTransform, Injector, Directive, ContentChildren, QueryList } from '@angular/core';
import * as _ from 'lodash-es';
import { IShBaseInputOptions, ShBaseInputComponent } from './base-input.component';
import { Observable, Subject, from, merge } from 'rxjs';
import { ShOptionComponent } from '../option/option.component';

/**
 * Lookup-value contract
 */
export interface ILookupSingle<V> {
  /**
   * Value identifier
   */
  id: string;
  /**
   * Value label to be shown
   */
  label: string;
  /**
   * References to user-options value
   */
  ref: V;
}

/**
 * Base Lookup Single Component options contract
 */
export interface IShBaseLookupSingleOptions<T, V>
  extends IShBaseInputOptions<T> {
  /**
   * List of values to use as lookup values
   */
  values?: V[] | Observable<V[]>;
  /**
   * Pipe which will be applied to lookup values to format label
   */
  valuesPipe?: PipeTransform;
  /**
   * Pipe arguments
   */
  valuesPipeArgs?: any[];
  /**
   * Equality function which optimizes the process of comparing
   */
  equalityFunc?: (modelValue: T, lookupValue: V) => boolean;
  /**
   * Function which transforms control value to model property value
   */
  transform?: (lookupValue: V) => T;
}

/**
 * Base Component which introduces the lookups
 */
@Directive()
export abstract class ShBaseLookupSingleComponent<T, V, O extends IShBaseLookupSingleOptions<T, V>>
  extends ShBaseInputComponent<T, O> {
  /**
   * Lookup values (converted values)
   */
  /*protected*/ public values: ILookupSingle<V>[];
  /**
   * Subject which notifies subscribers when user options changes
   */
  /*protected*/ public resetOptions$ = new Subject<void>();
  /**
   * False if almost one sh-option is specified in the component content
   */
  public legacyMode = true;
  /**
   * Selected value label (only with legacyMode = false)
   */
  public selectedLabel: string;
  /**
   * List of values ​​passed as ng-content to the component
   */
  @ContentChildren(ShOptionComponent) public contentValues: QueryList<ShOptionComponent<V>>;

  /**
   * Base Component which introduces the lookups
   */
  constructor(injector: Injector) {
    super(injector);
  }

  public ngAfterContentInit() {
    if (this.contentValues?.length) {
      this.setContentValues(this.contentValues.toArray() || []);
    }
    this.contentValues?.changes
      .pipe(takeUntil(this.destroy$))
      .subscribe((values: ShOptionComponent<V>[]) => {
        this.setContentValues(values);
      });
  }

  /*protected*/ public onOptionsChanges() {
    super.onOptionsChanges();
    this.extractValuesFromOptions();
  }

  /*protected*/ public onControlValueChanges() {
    const controlValue = this.getControlValue();
    if (!this.internalOptions.equalityFunc(this.getModelValue(), controlValue)) {
      this.setModelValue(this.internalOptions.transform(controlValue));
    }
    this._updateSelectedLabel(controlValue);
  }

  /*protected*/ public modelValueChangesHandler() {
    if (this.model) {
      const value = this.getModelValue();
      const controlValue = this.getControlValue();
      if (!this.internalOptions.equalityFunc(value, controlValue)) {
        if (this.onModelValueChanges) {
          this.onModelValueChanges(controlValue, value);
        }
        this.setControlValue(this.getSelectedValue());
      }
    }
  }

  /*protected*/ public getDefaultOptions(): IShBaseLookupSingleOptions<T, V> {
    return _.merge(super.getDefaultOptions(), {
      values: <V[]>[],
      equalityFunc: (modelValue: T, lookupValue: V) => _.isEqual(modelValue, lookupValue),
      transform: (lookupValue: V) => <any>lookupValue as T
    });
  }

  /**
   * Retrieves values from user options and converts these last into lookup-values
   */
  /*protected*/ public extractValuesFromOptions() {
    this.resetOptions$.next();
    if (this.isObservable(this.internalOptions.values)) {
      from(this.internalOptions.values)
        .pipe(takeUntil(merge(this.resetOptions$, this.destroy$)))
        .subscribe(this.setValues.bind(this));
    } else {
      this.setValues(this.internalOptions.values);
    }
  }

  /**
   * Setups lookup-values
   * @param values User-options values
   */
  public setValues(values: V[] | ShOptionComponent<V>[]) {
    this.values = values.map(this.convertValue.bind(this), this);
  }

  /**
   * Returns lookup-values
   * @return Lookup values
   */
  public getValues(): V[];
  /**
   * Returns lookup-value at index
   * @return Lookup value
   */
  public getValues(index: number): V;
  public getValues(index?: number) {
    const retval = this.values.map(v => v.ref) || [];
    if (!isNoU(index)) {
      return retval[index];
    }
    return retval;
  }

  /**
   * Adds new value to values
   * @param value New value
   */
  public addValue(value: V) {
    this.values.push(this.convertValue(value));
  }

  /**
   * Sets value basing on values index
   * @param index Value index
   */
  public setValueAtIndex(index: number) {
    const values = this.getValues();
    if (values) {
      this.setControlValue(values[index]);
    }
  }

  /**
   * Returns index of selected value
   */
  public getSelectedIndex() {
    let index = -1;
    const values = this.getValues();
    if (values) {
      const selectedValue = this.getControlValue();
      index = values.findIndex(v => v === selectedValue);
    }
    return index;
  }

  /**
   * Specifies whether index matches the selected value
   * @param index Value index
   */
  public isIndexSelected(index: number) {
    const values = this.getValues();
    if (values) {
      const value = this.getSelectedValue();
      return index === values.findIndex(v => v === value);
    }
    return false;
  }

  /**
   * Converts user options values to lookup-values
   * @param values User-options values
   */
  /*protected*/ public convertValue(value: V | ShOptionComponent<V>): ILookupSingle<V> {
    if (value instanceof ShOptionComponent) {
      return {
        id: this.idSequence.next(),
        label: value.text,
        ref: value.value
      };
    } else {
      return {
        id: this.idSequence.next(),
        label: this.getLabel(value),
        ref: value
      };
    }
  }

  /**
   * Retrieves label to be shown from pipe
   * @param value User-options value
   */
  /*protected*/ public getLabel(value: V) {
    if (this.internalOptions.valuesPipe) {
      if (this.internalOptions.valuesPipeArgs) {
        return this.internalOptions.valuesPipe.transform(value, ...this.internalOptions.valuesPipeArgs);
      }
      return this.internalOptions.valuesPipe.transform(value);
    } else {
      return String(value !== null ? value : '');
    }
  }

  public setControlValue(value: any) {
    super.setControlValue(value);
    this._updateSelectedLabel(value);
  }

  private _updateSelectedLabel(value: any) {
    if (!this.legacyMode) {
      if (this.contentValues?.length) {
        const selected = this.contentValues.find(v => {
          if (this.options?.equalityFunc) {
            return this.options.equalityFunc(this.formControl.value, value);
          } else if (v.key) {
            return v.value[v.key] === value[v.key];
          } else {
            return v.value === value;
          }
        });
        this.selectedLabel = selected?.text || value || '';
      } else {
        this.selectedLabel = '';
      }
    }
  }

  /**
   * Retrieves lookup selected value
   */
  private getSelectedValue() {
    let selectedRef: V;
    if (this.values) {
      selectedRef = this.values
        .map((value) => value.ref)
        .find((ref) => this.model ? this.internalOptions.equalityFunc(this.getModelValue(), ref) : ref === this.getControlValue());
    }
    return selectedRef || <any>this.getModelValue() as V;
  }

  /**
   *
   * @param values
   */
  private setContentValues(values: ShOptionComponent<V>[]) {
    this.legacyMode = false;
    this.setValues(values);
    if (!isNoU(this.formControl?.value)) {
      this.setControlValue(this.formControl.value);
    }
  }

  /**
   * Checks if a value is observable
   * @param value The value
   */
  private isObservable<TValue>(value: any): value is Observable<TValue> {
    return Boolean(value && value.subscribe);
  }

}
