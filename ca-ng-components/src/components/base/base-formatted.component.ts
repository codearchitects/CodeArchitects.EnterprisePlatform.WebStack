import { Injector } from '@angular/core';
import * as _ from 'lodash';
import 'jquery';
import { IShBaseInputOptions, ShBaseInputComponent } from './base-input.component';
import { ShFormControlMode } from '../../utilities/form-control.utility';

/**
 * Base Input Formatted Component options contract
 */
export interface IShBaseFormattedOptions<T>
  extends IShBaseInputOptions<T> {
  /**
   * The format of the text
   */
  format?: string;
}

/**
 * Base Component which introduces the text formatting
 */
export abstract class ShBaseFormattedComponent<T, O extends IShBaseFormattedOptions<T>>
  extends ShBaseInputComponent<T, O> {
  /**
   * Context mode: Browse or Edit
   */
  public get mode() { return this.formControl && this.formControl.mode; }
  /**
   * Stores the old value to allow rollback
   */
  protected oldValue = '';
  /**
   * Performs a tolerant check which if returns true
   * allows the commit
   */
  protected abstract tolerantCheck(): boolean;
  /**
   * Parses control value to retrieves a new model value
   */
  protected abstract parseControlValue(): T;
  /**
   * Parses model property value to retrieves a new form control value
   */
  protected abstract formatModelValue(): string;

  /**
   * Base Component which introduces the text formatting
   */
  constructor(injector: Injector) {
    super(injector);
  }

  protected onControlValueChanges() {
    if (this.mode === ShFormControlMode.Edit) {
      if (this.tolerantCheck()) {
        this.commit();
      } else {
        this.rollback();
      }
    }
  }

  protected modelValueChangesHandler() {
    if (this.mode === ShFormControlMode.Browse) {
      this.updateControlValue();
    }
  }

  /**
   * Applies the changes to the model property value
   */
  protected commit() {
    this.oldValue = this.getControlValue();
    this.updateModelValue();
  }

  /**
   * Rollbacks the changes and restore the old value
   */
  protected rollback() {
    if (!_.isEqual(this.getControlValue(), this.oldValue)) {
      this.setControlValue(this.oldValue);
    }
  }

  /**
   * Updates control value
   * @param value new value
   */
  protected updateControlValue(value = this.formatModelValue()) {
    if (!_.isEqual(this.getControlValue(), value)) {
      this.setControlValue(value);
    }
  }

  /**
   * Updates model property value
   * @param value new value
   */
  protected updateModelValue(value = this.parseControlValue()) {
    if (!_.isEqual(this.getModelValue(), value)) {
      this.setModelValue(value);
    }
  }

  /**
   * Event fired when input control takes the focus
   * @param event HTML5 event
   */
  protected onFocusIn(event?: FocusEvent) {
    this.formControl.mode = ShFormControlMode.Edit;
    this.updateControlValue();
    if (event) {
      $(event.target).select();
    }
  }

  /**
   * Event fired when input control loses the focus
   * @param event HTML5 event
   */
  protected onFocusOut(event?: FocusEvent) {
    this.formControl.mode = ShFormControlMode.Browse;
    this.updateControlValue();
  }

}
