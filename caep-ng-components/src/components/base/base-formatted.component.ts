import { Directive, Injector } from '@angular/core';
import * as _ from 'lodash-es';
//import 'jquery';
import { CaepHook, CaepHookType } from '../../decorators';
import { CaepPipeTransform } from '../../pipes';
import { PickAll, isNoU } from '../../utilities/common.utility';
import { CaepFormControlMode } from '../../utilities/form-control.utility';
import { CaepBaseInputComponent, CaepBaseInputOptions } from './base-input.component';

export interface ICaepBaseFormattedOptions<T, Z = any> extends PickAll<CaepBaseFormattedOptions<T, Z>> {}

/**
 * Base Input Formatted Component options contract
 */
export class CaepBaseFormattedOptions<T, Z = any> extends CaepBaseInputOptions<T> {
  /**
   * The format of the text
   */
  //format?: string;

  /**
   * Name of the pipe to use for formatting
   */
  transform?: string;

  /**
   * Pipe args object
   */
  transformArgs?: Z;

  constructor(options?: ICaepBaseFormattedOptions<T, Z>) {
    super(options);
  }
}

/**
 * Base Component which introduces the text formatting
 */
@Directive()
export abstract class CaepBaseFormattedComponent<
  T,
  O extends CaepBaseFormattedOptions<T> = CaepBaseFormattedOptions<T>
> extends CaepBaseInputComponent<T, O> {
  /**
   * Context mode: Browse or Edit
   */
  public get mode() {
    return this.formControl && this.formControl.mode;
  }

  /**
   * Stores the old value to allow rollback
   */
  public oldValue = '';

  /**
   * Formatting pipe
   */
  protected formatPipe: CaepPipeTransform<T>;

  //protected format: string;

  /**
   * Performs a tolerant check which if returns true
   * allows the commit
   */
  public abstract tolerantCheck(): boolean;

  /**
   * Parses control value to retrieve a new model value
   */
  public abstract parseControlValue(): T;

  /**
   * Parses model property value to retrieve a new form control value
   */
  public abstract formatModelValue(): string;

  /**
   * Base Component which introduces the text formatting
   */
  constructor(
    injector: Injector,
    optionsCtor: (value?: PickAll<O>) => O = (value?: PickAll<O>) => new CaepBaseFormattedOptions(value) as O
  ) {
    super(injector, optionsCtor);
  }

  public onControlValueChanges() {
    if (this.mode === CaepFormControlMode.Edit) {
      let tolerantCheckResult: boolean;
      if (this.formatPipe) {
        tolerantCheckResult = this.formatPipe.tolerantCheck(
          this.getControlValue(),
          this.mode,
          this.options.transformArgs
        );
      } else {
        tolerantCheckResult = this.tolerantCheck();
      }
      if (tolerantCheckResult) {
        this.commit();
      } else {
        this.rollback();
      }
    }
  }

  public modelValueChangesHandler() {
    if (this.mode === CaepFormControlMode.Browse) {
      this.updateControlValue();
    }
  }

  /**
   * Applies the changes to the model property value
   */
  public commit() {
    this.oldValue = this.getControlValue();
    this.updateModelValue();
  }

  /**
   * Rollbacks the changes and restore the old value
   */
  public rollback() {
    if (!_.isEqual(this.getControlValue(), this.oldValue)) {
      this.setControlValue(this.oldValue);
    }
  }

  /**
   * Updates control value
   * @param value new value
   */
  public updateControlValue(value = undefined) {
    if (isNoU(value)) {
      if (this.formatPipe)
        value = this.formatPipe.transform(this.getModelValue(), this.mode, this.options.transformArgs);
      else value = this.formatModelValue();
    }
    if (!_.isEqual(this.getControlValue(), value)) {
      this.setControlValue(value);
    }
  }

  /**
   * Updates model property value
   * @param value new value
   */
  public updateModelValue(value = undefined) {
    if (isNoU(value)) {
      if (this.formatPipe)
        value = this.formatPipe.revert(this.getControlValue(), this.mode, this.options.transformArgs);
      else value = this.parseControlValue();
    }
    if (!_.isEqual(this.getModelValue(), value)) {
      this.setModelValue(value);
    }
  }

  /**
   * Event fired when input control takes the focus
   * @param event HTML5 event
   */
  public onFocusIn(event?: FocusEvent) {
    this.formControl.mode = CaepFormControlMode.Edit;
    this.updateControlValue();
    if (event) $(event.target).trigger('select');
  }

  /**
   * Event fired when input control loses the focus
   * @param event HTML5 event
   */
  public onFocusOut(event?: FocusEvent) {
    this.formControl.mode = CaepFormControlMode.Browse;
    this.updateControlValue();
  }

  /**
   * Initializes format pipe instance if options specify its name
   */
  @CaepHook({ type: CaepHookType.Init, priority: 1 })
  private initializeFormatPipe() {
    if (this.options.transform) {
      const pipeToken = this.pipeMapper.findPipeByName(this.options.transform);
      if (pipeToken) this.formatPipe = new pipeToken(this.injector) as CaepPipeTransform<T>; //this.injector.get<CaepPipeTransform<T>>(pipeToken);
    }
  }
}
