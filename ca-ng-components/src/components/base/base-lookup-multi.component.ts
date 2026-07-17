import { PipeTransform, Injector } from '@angular/core';
import * as _ from 'lodash';
import { Observable, Subject, from, merge } from 'rxjs';
import { IShBaseInputOptions, ShBaseInputComponent } from './base-input.component';
import { takeUntil } from 'rxjs/operators';
import { ShFormControl } from '../../utilities/form-control.utility';

/**
 * Lookup-value contract
 */
export interface ILookupMulti<V> {
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
  /**
   * Form control related to value reference
   */
  formControl: ShFormControl;
}

/**
 * Base Lookup Multi Component options contract
 */
export interface IShBaseLookupMultiOptions<T, V>
  extends IShBaseInputOptions<T[]> {
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
  transform?: (lookupValues: V[]) => T[];
}

/**
 * Base Component which introduces the lookups multiple
 */
export abstract class ShBaseLookupMultiComponent<T, V, O extends IShBaseLookupMultiOptions<T, V>>
  extends ShBaseInputComponent<T[], O> {
  /**
   * Lookup values (converted values)
   */
  protected values: ILookupMulti<V>[];
  /**
   * Subject which notifies subscribers when user options changes
   */
  protected resetOptions$ = new Subject();

  /**
   * Base Component which introduces the lookups multiple
   */
  constructor(injector: Injector) {
    super(injector);
  }

  protected onOptionsChanges() {
    super.onOptionsChanges();
    this.extractValuesFromOptions();
  }

  protected setControlValue(newValue: any) {
    super.setControlValue(newValue);
    if (this.values) {
      this.values.forEach((value) => {
        if (newValue.includes(value.ref)) {
          value.formControl.setValue(true, { emitEvent: false });
        } else {
          value.formControl.setValue(false, { emitEvent: false });
        }
      });
    }
  }

  protected onControlValueChanges() {
    if (!this.isEquivalent(this.getModelValue(), this.getControlValue())) {
      this.setModelValue(this.internalOptions.transform(this.getControlValue()));
    }
  }

  protected modelValueChangesHandler() {
    const value = this.getModelValue();
    const controlValue = this.getControlValue();
    if (!this.isEquivalent(value, controlValue)) {
      if (this.onModelValueChanges) {
        this.onModelValueChanges(controlValue, value);
      }
      this.setControlValue(this.getSelectedValues());
    }
  }

  protected getDefaultOptions(): IShBaseLookupMultiOptions<T, V> {
    return _.merge(super.getDefaultOptions(), {
      values: <V[]>[],
      equalityFunc: (modelValue: T, lookupValue: V) => _.isEqual(<any>modelValue, lookupValue),
      transform: (lookupValues: V[]) => lookupValues && lookupValues.map((value) => <any>value as T)
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
  protected setValues(values: V[]) {
    this.values = values.map(this.convertValue, this);
  }

  /**
   * Converts user options values to lookup-values
   * @param values User-options values
   */
  protected convertValue(value: V): ILookupMulti<V> {
    return {
      id: this.idSequence.next(),
      label: this.getLabel(value),
      ref: value,
      formControl: this.getFormControl(value)
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
      return String(value);
    }
  }

  /**
   * Retrieves lookup selected values
   */
  private getSelectedValues() {
    let selectedRefs: V[];
    if (this.values) {
      selectedRefs = this.values
        .map((value) => value.ref)
        .filter((ref) => this.isIncludedInModel(ref));
    }
    return selectedRefs
      || <any>this.getModelValue() as V[];
  }

  /**
   * Creates form control for value
   */
  protected createFormControl() {
    super.createFormControl();
    this.setControlValue(this.getSelectedValues());
  }

  /**
   * Retrieves form control related to value
   * @param value
   */
  protected getFormControl(value: V) {
    let formState = false;
    if (this.getModelValue()) {
      formState = this.isIncludedInModel(value);
    }
    const formControl = new ShFormControl(formState);
    from(formControl.valueChanges)
      .pipe(takeUntil(merge(this.resetOptions$, this.destroy$)))
      .subscribe((exists) => exists ? this.addToControl(value) : this.removeFromControl(value));
    return formControl;
  }

  /**
   * Checks if value is included into model property values
   * @param value The value
   */
  protected isIncludedInModel(value: V) {
    return this.getModelValue()
      && this.getModelValue().some((model) => this.internalOptions.equalityFunc(model, value));
  }

  /**
   * Checks if value is included into form control values
   * @param value The value
   */
  protected isIncludedInControl(model: T) {
    return this.getControlValue()
      && this.getControlValue().some((value: V) => this.internalOptions.equalityFunc(model, value));
  }

  /**
   * Checks if model property values and form control values are equivalent
   * @param modelValues Model property values
   * @param lookupValues Form control values
   */
  private isEquivalent(modelValues: T[], lookupValues: V[]) {
    return modelValues && modelValues.every((model) => this.isIncludedInControl(model))
      && lookupValues && lookupValues.every((value) => this.isIncludedInModel(value));
  }

  /**
   * Adds value to form control
   * @param value The value
   */
  private addToControl(value: V) {
    const controlValues = <V[]>this.getControlValue();
    if (controlValues && controlValues.indexOf(value) === -1) {
      this.setControlValue([...controlValues, value]);
    }
  }

  /**
   * Removes value from form control
   * @param value The value
   */
  private removeFromControl(value: V) {
    const controlValues = <V[]>this.getControlValue();
    if (controlValues && controlValues.indexOf(value) !== -1) {
      this.setControlValue(controlValues.filter((controlValue) => controlValue !== value));
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
