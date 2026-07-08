import { Directive, forwardRef, inject, Injector } from '@angular/core';
import { FormControlName, FormGroupDirective, NG_VALUE_ACCESSOR, NgControl, NgModel, PristineChangeEvent, TouchedChangeEvent } from '@angular/forms';
import { ShBaseFormattedComponent } from '../components/base/base-formatted.component';
import { filter, takeUntil } from 'rxjs';
import { ShFormControl } from '../utilities/form-control.utility';
import { ShControlValueAccessorDirective } from './control-value-accessor.directive';

/**
 * Directive that acts as a bridge between Angular forms and custom formatted input components.
 * Implements the ControlValueAccessor interface to integrate with Angular's form API.
 *
 * @template T - The type of the value managed by the form control.
 *
 * @selector [shFormattedControlValueAccessor]
 * @standalone true
 * @providers [
 *   {
 *     provide: NG_VALUE_ACCESSOR,
 *     useExisting: forwardRef(() => ShFormattedControlValueAccessorDirective),
 *     multi: true,
 *   },
 * ]
 */
@Directive({
  selector: '[shFormattedControlValueAccessor]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ShFormattedControlValueAccessorDirective),
      multi: true,
    },
  ],
})
/**
 * Directive that acts as a bridge between Angular forms API and a custom formatted input component.
 * Implements the `ControlValueAccessor` interface to integrate with Angular forms.
 *
 * @template T - The type of the value managed by the form control.
 */
export class ShFormattedControlValueAccessorDirective<T> extends ShControlValueAccessorDirective<T> {
  
  public override host: ShBaseFormattedComponent<T, any>;

  /**
   * OnChange function registered by Angular forms
   */
  public onChangeFn: (value: T) => void;

  /**
   * OnTouched function registered by Angular forms
   */
  public onTouchedFn: () => void;

  /**
   * The Angular form control associated with this directive.
   */
  public formControl?: ShFormControl<T>;

  public override ngOnInit() {
    this.ngControl = this.injector.get(NgControl, null);
    this.ngModel = this.injector.get(NgModel, null);
    if (this.ngControl instanceof FormControlName) {
      const formGroupDirective: FormGroupDirective = this.ngControl['_parent'];
      if (formGroupDirective) {
        this.formControl = formGroupDirective.form.controls[this.ngControl.name] as ShFormControl<T>;
      }
    }
    if (this.ngControl?.control) {
      this.formControl = this.ngControl.control as ShFormControl<T>;
    }
    if (this.formControl) {
      this.formControl.focus$?.pipe(takeUntil(this.host.destroy$)).subscribe(() => this.host.giveFocus());
      this.formControl.events.pipe(takeUntil(this.host.destroy$)).subscribe(event => {
        if (event instanceof TouchedChangeEvent) {
          if (event.touched && !this.host.formControl.touched) {
            this.host.formControl.markAsTouched();
          } else if (!event.touched && this.host.formControl.touched) {
            this.host.formControl.markAsUntouched();
          }
        } else if (event instanceof PristineChangeEvent) {
          if (event.pristine && !this.host.formControl.pristine) {
            this.host.formControl.markAsPristine();
          } else if (!event.pristine && this.host.formControl.pristine) {
            this.host.formControl.markAsDirty();
          }
        }
      });

      if (this.ngModel) {
        this.formControl.valueChanges
          .pipe(
            filter(value => value !== this.ngModel.model),
            takeUntil(this.host.destroy$!)
          ).subscribe(value => this.ngModel.viewToModelUpdate(value));
      }
    }
  }

  public override writeValue(value: T): void {
    this.host.setModelValue(value);
  }

  public override registerOnChange(fn: (value: T) => void): void {
    this.onChangeFn = fn;
  }

  public override registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  public override setDisabledState(isDisabled: boolean): void {
    this.host.enable = !isDisabled;
  }
  
}
