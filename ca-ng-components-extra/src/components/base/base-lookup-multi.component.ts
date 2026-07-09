import { ContentChildren, Directive, Injector, PipeTransform, QueryList } from '@angular/core';
import * as _ from 'lodash-es';
import { Observable, Subject, from, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CaepContentChildren, CaepHook, CaepHookType, CaepOption } from '../../decorators';
import { CaepSimpleOptionsChange } from '../../models';
import { PickAll, isNoU } from '../../utilities/common.utility';
import { CaepFormControl } from '../../utilities/form-control.utility';
import { CaepOptionComponent } from '../option/option.component';
import { CaepBaseInputComponent, CaepBaseInputOptions } from './base-input.component';

/**
 * Lookup-value contract
 */
export interface ICaepLookupMulti<V> {
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
  formControl: CaepFormControl;
}

export interface ICaepBaseLookupMultiOptions<T, V> extends PickAll<CaepBaseLookupMultiOptions<T, V>> {}

/**
 * Base Lookup Multi Component options contract
 */
export class CaepBaseLookupMultiOptions<T, V> extends CaepBaseInputOptions<T[]> {
  /**
   * List of values to use as lookup values
   */
  @CaepOption({ defaultValue: [] })
  values?: V[] | Observable<V[]>;

  /**
   * Pipe which will be applied to lookup values to format label
   */
  valuesPipe?: string;

  /**
   * Pipe arguments
   */
  valuesPipeArgs?: any[];

  /**
   * Equality function which optimizes the process of comparing
   */
  @CaepOption({ defaultValue: (modelValue: T, lookupValue: V) => _.isEqual(modelValue, lookupValue) })
  equalityFunc?: (modelValue: T, lookupValue: V) => boolean;

  /**
   * Function which transforms control value to model property value
   */
  @CaepOption({ defaultValue: (lookupValues: V[]) => lookupValues && lookupValues.map(value => (<any>value) as T) })
  transform?: (lookupValues: V[]) => T[];

  constructor(options?: ICaepBaseLookupMultiOptions<T, V>) {
    super(options);
  }
}

/**
 * Base Component which introduces the lookups multiple
 */
@Directive()
export abstract class CaepBaseLookupMultiComponent<
  T,
  V,
  O extends CaepBaseLookupMultiOptions<T, V> = CaepBaseLookupMultiOptions<T, V>
> extends CaepBaseInputComponent<T[], O> {
  /**
   * Lookup values (converted values)
   */
  public values: ICaepLookupMulti<V>[];

  /**
   * Subject which notifies subscribers when user options changes
   */
  public resetOptions$ = new Subject<void>();

  /**
   * Selected values labels
   */
  public selectedLabels: string[] = [];

  /**
   * List of values ​​passed as ng-content to the component
   */
  @CaepContentChildren(CaepOptionComponent)
  @ContentChildren(CaepOptionComponent)
  public contentValues: QueryList<CaepOptionComponent<V>>;

  /**
   * Pipe which will be applied to lookup values to format label
   */
  protected valuesPipe: PipeTransform;

  /**
   * Base Component which introduces the lookups multiple
   */
  constructor(
    injector: Injector,
    optionsCtor: (value?: PickAll<O>) => O = (value?: PickAll<O>) => new CaepBaseLookupMultiOptions(value) as O
  ) {
    super(injector, optionsCtor);
  }

  public setControlValue(newValue: any) {
    super.setControlValue(newValue);
    this.updateValuesStateAndSelectedLabels();
  }

  public onControlValueChanges() {
    if (!this.isEquivalent(this.getModelValue(), this.getControlValue())) {
      this.setModelValue(this.options.transform(this.getControlValue()));
    }
  }

  public modelValueChangesHandler() {
    const value = this.getModelValue();
    const controlValue = this.getControlValue();
    if (!this.isEquivalent(value, controlValue)) {
      if (this.onModelValueChanges) {
        this.onModelValueChanges(controlValue, value);
      }
      this.setControlValue(this.getSelectedValues());
    }
  }

  /**
   * Retrieves values from user options and converts these last into lookup-values
   */
  public extractValuesFromOptions() {
    this.resetOptions$.next();
    if (this.isObservable(this.options.values)) {
      from(this.options.values)
        .pipe(takeUntil(merge(this.resetOptions$, this.destroy$)))
        .subscribe((values: V[]) => {
          this.setValues(values);
          if (this.formControl) this.setControlValue(this.getSelectedValues());
        });
    } else {
      this.setValues(this.options.values);
    }
  }

  /**
   * Setups lookup-values
   * @param values User-options values
   */
  public setValues(values: V[] | CaepOptionComponent<V>[]) {
    this.values = values.map(this.convertValue.bind(this), this);
  }

  /**
   * Converts user options values to lookup-values
   * @param values User-options values
   */
  public convertValue(value: V | CaepOptionComponent<V>): ICaepLookupMulti<V> {
    if (value instanceof CaepOptionComponent) {
      return {
        id: this.idSequence.next(),
        label: value.text,
        ref: value.value,
        formControl: this.getFormControl(value.value)
      };
    } else {
      return {
        id: this.idSequence.next(),
        label: this.getLabel(value),
        ref: value,
        formControl: this.getFormControl(value)
      };
    }
  }

  /**
   * Retrieves label to be shown from pipe
   * @param value User-options value
   */
  public getLabel(value: V) {
    if (this.valuesPipe) {
      if (this.options.valuesPipeArgs) {
        return this.valuesPipe.transform(value, ...this.options.valuesPipeArgs);
      }
      return this.valuesPipe.transform(value);
    } else {
      return String(!isNoU(value) ? value : ''); //String(value);
    }
  }

  /**
   * Creates form control for value
   */
  public createFormControl() {
    super.createFormControl();
    this.setControlValue(this.getSelectedValues());
    /*const selectedValues = this.getSelectedValues();
    if(selectedValues !== <any>this.getModelValue() as V[])
      this.setControlValue(selectedValues);*/
  }

  /**
   * Retrieves form control related to value
   * @param value
   */
  public getFormControl(value: V) {
    let formState = false;
    if (this.getModelValue()) {
      formState = this.isIncludedInModel(value);
    }
    const formControl = new CaepFormControl(formState);
    from(formControl.valueChanges)
      .pipe(takeUntil(merge(this.resetOptions$, this.destroy$)))
      .subscribe(exists => (exists ? this.addToControl(value) : this.removeFromControl(value)));
    return formControl;
  }

  /**
   * Checks if value is included into model property values
   * @param value The value
   */
  public isIncludedInModel(value: V) {
    return this.getModelValue()?.some(model => this.options.equalityFunc(model, value));
  }

  /**
   * Checks if value is included into form control values
   * @param value The value
   */
  public isIncludedInControl(model: T) {
    return this.getControlValue()?.some((value: V) => this.options.equalityFunc(model, value));
  }

  /**
   * Checks if model property values and form control values are equivalent
   * @param modelValues Model property values
   * @param lookupValues Form control values
   */
  private isEquivalent(modelValues: T[], lookupValues: V[]) {
    if (isNoU(modelValues) && isNoU(lookupValues)) return <any>modelValues === <any>lookupValues;
    else
      return (
        modelValues?.every(model => this.isIncludedInControl(model)) &&
        lookupValues?.every(value => this.isIncludedInModel(value))
      );
  }

  /**
   * Adds value to form control
   * @param value The value
   */
  private addToControl(value: V) {
    const controlValues = <V[]>this.getControlValue();
    if (controlValues?.indexOf(value) === -1) {
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
      this.setControlValue(controlValues.filter(controlValue => controlValue !== value));
    }
  }

  /**
   * Retrieves lookup selected values
   */
  private getSelectedValues() {
    //supported defaulting model property with different instance (but with same value) from the ones in values, supported values dynamic update
    //return this.getModelValue() || [];
    let selectedRefs: V[];
    selectedRefs = this.values?.map(value => value.ref).filter(ref => this.isIncludedInModel(ref));
    return selectedRefs ? selectedRefs : this.getModelValue() ? ((<any>this.getModelValue()) as V[]) : [];
    //return selectedRefs?.length ? selectedRefs : ( this.getModelValue() ? <any>this.getModelValue() as V[] : [] );
  }

  /**
   * Sets component values using content children values and updates control values if necessary
   *
   * @param values user option values
   */
  private setContentValues(values: CaepOptionComponent<V>[]) {
    this.setValues(values);
    const selectedValues = this.getSelectedValues();
    if (selectedValues !== ((<any>this.getModelValue()) as V[])) this.setControlValue(selectedValues);
    else if (this.getControlValue()?.length) {
      this.updateValuesStateAndSelectedLabels();
      //this.setControlValue(this.formControl.value);
    }
  }

  /**
   * Event fired when user options changes
   *
   * @param change CaepSimpleOptionsChange object containing option changes
   */
  @CaepHook({ type: CaepHookType.OptionsChanges, priority: 1 })
  protected onLookupOptionsChange(change: CaepSimpleOptionsChange) {
    if (change.currentOptions.valuesPipe !== change.previousOptions.valuesPipe) {
      this.updateValuesPipe();
      if (
        _.isEqual(change.currentOptions.values, change.previousOptions.values) &&
        change.currentOptions.valuesPipeArgs === change.previousOptions.valuesPipeArgs
      ) {
        this.extractValuesFromOptions();
        if (this.getControlValue()?.length) this.updateValuesStateAndSelectedLabels();
      }
    }
    if (
      !_.isEqual(change.currentOptions.values, change.previousOptions.values) ||
      change.currentOptions.valuesPipeArgs !== change.previousOptions.valuesPipeArgs
    ) {
      this.extractValuesFromOptions();
      if (this.getControlValue()?.length) this.setControlValue(this.getSelectedValues());
    }
  }

  /**
   * Initializes content values and subscribes to content children changes
   */
  @CaepHook({ type: CaepHookType.AfterContentInit })
  private initializeContentValues() {
    if (this.contentValues?.length) {
      this.setContentValues(this.contentValues.toArray() || []);
    }
    this.contentValues?.changes.pipe(takeUntil(this.destroy$)).subscribe((values: CaepOptionComponent<V>[]) => {
      this.setContentValues(values);
    });
  }

  /**
   * Initializes values pipe instance if options specify its name
   */
  private updateValuesPipe() {
    if (this.options.valuesPipe) {
      const pipeToken = this.pipeMapper.findPipeByName(this.options.valuesPipe);
      if (pipeToken) this.valuesPipe = new pipeToken(this.injector);
    }
  }

  /**
   * Updates lookups state and selected labels
   */
  private updateValuesStateAndSelectedLabels() {
    this.selectedLabels = [];
    if (this.contentValues?.length) {
      this.contentValues.forEach(v => {
        let exist = false;
        this.getControlValue().some(value => {
          if (v.key) exist = v.value[v.key] === value[v.key];
          else exist = v.value === value;
          //exist = _.isEqual(v.value, value);
          if (exist) {
            const lookupValue = this.values.find(lookup => lookup.ref === value);
            lookupValue.formControl.setValue(true, { emitEvent: false });
            this.selectedLabels.push(lookupValue.label);
            return true;
          } else return false;
        });
        if (!exist) {
          const lookupValue = this.values.find(lookup => lookup.ref === v.value);
          lookupValue.formControl.setValue(false, { emitEvent: false });
        }
      });
    } else {
      if (this.values) {
        this.values.forEach(v => {
          let exist = false;
          this.getControlValue().some(value => {
            exist = v.ref === value;
            if (exist) {
              v.formControl.setValue(true, { emitEvent: false });
              this.selectedLabels.push(v.label);
              return true;
            } else return false;
          });
          if (!exist) {
            v.formControl.setValue(false, { emitEvent: false });
          }
        });
      } else {
        this.selectedLabels.push(...this.getControlValue().map(value => this.getLabel(value)));
      }
    }
  }
}
