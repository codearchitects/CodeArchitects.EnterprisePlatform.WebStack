import { ContentChildren, Directive, Injector, PipeTransform, QueryList } from '@angular/core';
import * as _ from 'lodash-es';
import { Observable, Subject, from, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CaepContentChildren, CaepHook, CaepHookType, CaepOption } from '../../decorators';
import { CaepSimpleOptionsChange } from '../../models';
import { PickAll, isNoU } from '../../utilities/common.utility';
import { CaepOptionComponent } from '../option/option.component';
import { CaepBaseInputComponent, CaepBaseInputOptions } from './base-input.component';

/**
 * Lookup-value contract
 */
export interface ICaepLookupSingle<V> {
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

export interface ICaepBaseLookupSingleOptions<T, V> extends PickAll<CaepBaseLookupSingleOptions<T, V>> {}

/**
 * Base Lookup Single Component options contract
 */
export class CaepBaseLookupSingleOptions<T, V> extends CaepBaseInputOptions<T> {
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
  @CaepOption({ defaultValue: (lookupValue: V) => (<any>lookupValue) as T })
  transform?: (lookupValue: V) => T;

  constructor(options?: ICaepBaseLookupSingleOptions<T, V>) {
    super(options);
  }
}

/**
 * Base Component which introduces the lookups single
 */
@Directive()
export abstract class CaepBaseLookupSingleComponent<
  T,
  V,
  O extends CaepBaseLookupSingleOptions<T, V> = CaepBaseLookupSingleOptions<T, V>
> extends CaepBaseInputComponent<T, O> {
  /**
   * Lookup values (converted values)
   */
  public values: ICaepLookupSingle<V>[]; //to initialize?

  /**
   * Subject which notifies subscribers when user options changes
   */
  public resetOptions$ = new Subject<void>();

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
   * Selected value label
   */
  public selectedLabel: string;

  /**
   * Base Component which introduces the lookups
   */
  constructor(
    injector: Injector,
    optionsCtor: (value?: PickAll<O>) => O = (value?: PickAll<O>) => new CaepBaseLookupSingleOptions(value) as O
  ) {
    super(injector, optionsCtor);
  }

  public onControlValueChanges() {
    if (!this.options.equalityFunc(this.getModelValue(), this.getControlValue())) {
      this.setModelValue(this.options.transform(this.getControlValue()));
    }
  }

  public modelValueChangesHandler() {
    const value = this.getModelValue();
    const controlValue = this.getControlValue();
    if (!this.options.equalityFunc(value, controlValue)) {
      if (this.onModelValueChanges) {
        this.onModelValueChanges(controlValue, value);
      }
      this.setControlValue(this.getSelectedValue());
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
          if (this.formControl && this.getControlValue() !== this.getSelectedValue())
            this.setControlValue(this.getSelectedValue());
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
    const retval = this.values?.map(v => v.ref) || [];
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
  public convertValue(value: V | CaepOptionComponent<V>): ICaepLookupSingle<V> {
    if (value instanceof CaepOptionComponent) {
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
  public getLabel(value: V) {
    if (this.valuesPipe) {
      if (this.options.valuesPipeArgs) {
        return this.valuesPipe.transform(value, ...this.options.valuesPipeArgs);
      }
      return this.valuesPipe.transform(value);
    } else {
      return String(!isNoU(value) ? value : '');
    }
  }

  public setControlValue(value: any) {
    super.setControlValue(value);
    this.updateSelectedLabel();
  }

  /**
   * Retrieves lookup selected value
   */
  private getSelectedValue() {
    let selectedRef: V;
    if (this.values) {
      selectedRef = this.values
        .map(value => value.ref)
        .find(ref => this.options.equalityFunc(this.getModelValue(), ref));
      return selectedRef;
    } else return (<any>this.getModelValue()) as V;
  }

  /**
   * Sets component values using content children values and updates control values if necessary
   *
   * @param values user option values
   */
  private setContentValues(values: CaepOptionComponent<V>[]) {
    this.setValues(values);
    const selected = this.getSelectedValue();
    if (selected !== ((<any>this.getModelValue()) as V)) this.setControlValue(selected);
    else if (!isNoU(this.getControlValue())) this.updateSelectedLabel();
  }

  /**
   * Event fired when user options changes
   *
   * @param change CaepSimpleOptionsChange object containing option changes
   */
  @CaepHook({ type: CaepHookType.OptionsChanges, priority: 1 })
  private onLookupOptionsChange(change: CaepSimpleOptionsChange) {
    if (change.currentOptions.valuesPipe !== change.previousOptions.valuesPipe) {
      this.updateValuesPipe();
      if (
        _.isEqual(change.currentOptions.values, change.previousOptions.values) &&
        change.currentOptions.valuesPipeArgs === change.previousOptions.valuesPipeArgs
      ) {
        this.extractValuesFromOptions();
        if (this.getControlValue()) this.updateSelectedLabel();
      }
    }
    if (
      !_.isEqual(change.currentOptions.values, change.previousOptions.values) ||
      change.currentOptions.valuesPipeArgs !== change.previousOptions.valuesPipeArgs
    ) {
      this.extractValuesFromOptions();
      if (this.getControlValue()) this.setControlValue(this.getSelectedValue());
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
   * Initializes selected label model property value is already defined
   */
  @CaepHook({ type: CaepHookType.AfterContentInit })
  private initializeSelectedLabel() {
    if (this.getControlValue()) this.updateSelectedLabel();
  }

  /**
   * Updates selected label
   */
  private updateSelectedLabel() {
    //supported defaulting model property with different instance (but with same value) from the ones in values, supported values dynamic update
    if (this.contentValues?.length) {
      const selected = this.contentValues.find(v => {
        /*if (this.options?.equalityFunc) {
          return this.options.equalityFunc(this.formControl.value, value);
        } else*/ if (v.key) {
          return v.value[v.key] === this.getControlValue()[v.key];
        } else {
          return v.value === this.getControlValue();
          //return _.isEqual(v.value, this.getControlValue());
        }
      });
      this.selectedLabel = selected?.text || this.getControlValue() || '';
    } else {
      this.selectedLabel = this.getLabel(this.getControlValue());
    }
  }
}
