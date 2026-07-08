import { Injector, Directive, inject, OnInit } from '@angular/core';
import * as _ from 'lodash-es';
import 'jquery';
import { IShBaseInputOptions, ShBaseInputComponent } from './base-input.component';
import { ShFormControlMode } from '../../utilities/form-control.utility';
import { ShFormattedControlValueAccessorDirective } from '../../directives/formatted-control-value-accessor.directive';
import { takeUntil } from 'rxjs';
import { TouchedChangeEvent } from '@angular/forms';
import { FORMATTED_CVA_MODEL_PROPERTY_NAME } from '../../utilities/common.utility';

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
@Directive()
export abstract class ShBaseFormattedComponent<T, O extends IShBaseFormattedOptions<T>> extends ShBaseInputComponent<T, O> implements OnInit {
  /**
   * Context mode: Browse or Edit
   */
  public get mode() { return this.formControl && this.formControl.mode; }
  /**
   * Stores the old value to allow rollback
   */
  /*protected*/ public oldValue = '';
  /**
   * Performs a tolerant check which if returns true
   * allows the commit
   */
  /*protected*/ public abstract tolerantCheck(): boolean;
  /**
   * Parses control value to retrieves a new model value
   */
  /*protected*/ public abstract parseControlValue(): T;
  /**
   * Parses model property value to retrieves a new form control value
   */
  /*protected*/ public abstract formatModelValue(): string;

  protected override _controlValueAccessor? = inject(ShFormattedControlValueAccessorDirective<T>, { optional: true });

  /**
   * Base Component which introduces the text formatting
   */
  constructor(injector: Injector) {
    super(injector);
    if (this._controlValueAccessor) {
      this._controlValueAccessor.host = this;
    }
  }

  public ngOnInit(): void {
    if (this._controlValueAccessor && !this.model) {
      this.model = {};
      this.prop = FORMATTED_CVA_MODEL_PROPERTY_NAME;
      super.ngOnInit();
      this.formControl.events.pipe(takeUntil(this.destroy$)).subscribe(event => {
        if (event instanceof TouchedChangeEvent && event.touched) {
          this._controlValueAccessor.onTouchedFn();
        }
      });
    } else {
      super.ngOnInit();
    }
  }

  /*protected*/ public onControlValueChanges() {
    if (this.mode === ShFormControlMode.Edit) {
      if (this.tolerantCheck()) {
        this.commit();
      } else {
        this.rollback();
      }
    }
  }

  /*protected*/ public modelValueChangesHandler() {
    if (this.mode === ShFormControlMode.Browse) {
      this.updateControlValue();
    }
  }

  /**
   * Applies the changes to the model property value
   */
  /*protected*/ public commit() {
    this.oldValue = this.getControlValue();
    this.updateModelValue();
  }

  /**
   * Rollbacks the changes and restore the old value
   */
  /*protected*/ public rollback() {
    if (!_.isEqual(this.getControlValue(), this.oldValue)) {
      this.setControlValue(this.oldValue);
    }
  }

  /**
   * Updates control value
   * @param value new value
   */
  /*protected*/ public updateControlValue(value = this.formatModelValue()) {
    if (!_.isEqual(this.getControlValue(), value)) {
      this.setControlValue(value);
    }
  }

  /**
   * Updates model property value
   * @param value new value
   */
  /*protected*/ public updateModelValue(value = this.parseControlValue()) {
    if (!_.isEqual(this.getModelValue(), value)) {
      this.setModelValue(value);
      this._controlValueAccessor?.onChangeFn?.(value);
    }
  }

  /**
   * Event fired when input control takes the focus
   * @param event HTML5 event
   */
  /*protected*/ public onFocusIn(event?: FocusEvent) {
    this.formControl.mode = ShFormControlMode.Edit;
    this.updateControlValue();
    this.oldValue = this.getControlValue();
    if (event) {
      $(event.target).select();
    }
  }

  /**
   * Event fired when input control loses the focus
   * @param event HTML5 event
   */
  /*protected*/ public onFocusOut(event?: FocusEvent) {
    this.formControl.mode = ShFormControlMode.Browse;
    this.updateControlValue();
  }

}
