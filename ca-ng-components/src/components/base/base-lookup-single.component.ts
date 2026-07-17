import { isNoU } from 'src/utilities/common.utility';
import { takeUntil } from 'rxjs/operators';
import { PipeTransform, Injector } from '@angular/core';
import * as _ from 'lodash';
import { IShBaseInputOptions, ShBaseInputComponent } from './base-input.component';
import { Observable, Subject, from, merge } from 'rxjs';

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
export abstract class ShBaseLookupSingleComponent<T, V, O extends IShBaseLookupSingleOptions<T, V>>
  extends ShBaseInputComponent<T, O> {
  /**
   * Lookup values (converted values)
   */
  protected values: ILookupSingle<V>[];
  /**
   * Subject which notifies subscribers when user options changes
   */
  protected resetOptions$ = new Subject();

  /**
   * Base Component which introduces the lookups
   */
  constructor(injector: Injector) {
    super(injector);
  }

  protected onOptionsChanges() {
    super.onOptionsChanges();
    this.extractValuesFromOptions();
  }

  protected onControlValueChanges() {
    if (!this.internalOptions.equalityFunc(this.getModelValue(), this.getControlValue())) {
      this.setModelValue(this.internalOptions.transform(this.getControlValue()));
    }
  }

  protected modelValueChangesHandler() {
    const value = this.getModelValue();
    const controlValue = this.getControlValue();
    if (!this.internalOptions.equalityFunc(value, controlValue)) {
      if (this.onModelValueChanges) {
        this.onModelValueChanges(controlValue, value);
      }
      this.setControlValue(this.getSelectedValue());
    }
  }

  protected getDefaultOptions(): IShBaseLookupSingleOptions<T, V> {
    return _.merge(super.getDefaultOptions(), {
      values: <V[]>[],
      equalityFunc: (modelValue: T, lookupValue: V) => _.isEqual(modelValue, lookupValue),
      transform: (lookupValue: V) => <any>lookupValue as T
    });
  }

  /**
   * Retrieves values from user options and converts these last into lookup-values
   */
  protected extractValuesFromOptions() {
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
  public setValues(values: V[]) {
    this.values = values.map(this.convertValue, this);
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
  protected convertValue(value: V): ILookupSingle<V> {
    return {
      id: this.idSequence.next(),
      label: this.getLabel(value),
      ref: value
    };
  }

  /**
   * Retrieves label to be shown from pipe
   * @param value User-options value
   */
  protected getLabel(value: V) {
    if (this.internalOptions.valuesPipe) {
      if (this.internalOptions.valuesPipeArgs) {
        return this.internalOptions.valuesPipe.transform(value, ...this.internalOptions.valuesPipeArgs);
      }
      return this.internalOptions.valuesPipe.transform(value);
    } else {
      return String(value !== null ? value : '');
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
        .find((ref) => this.internalOptions.equalityFunc(this.getModelValue(), ref));
    }
    return selectedRef || <any>this.getModelValue() as V;
  }

  /**
   * Checks if a value is observable
   * @param value The value
   */
  private isObservable<TValue>(value: any): value is Observable<TValue> {
    return Boolean(value && value.subscribe);
  }

}
