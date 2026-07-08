import { Directive, forwardRef, inject, Injector } from '@angular/core';
import { ControlValueAccessor, FormControlName, FormGroupDirective, NG_VALUE_ACCESSOR, NgControl, NgModel } from '@angular/forms';
import { ShBaseInputComponent } from '../components/base/base-input.component';
import { filter, noop, takeUntil } from 'rxjs';
import { ShFormControl } from '../utilities/form-control.utility';

/**
 * Directive that acts as a bridge between Angular forms and custom input components.
 * Implements the ControlValueAccessor interface to integrate with Angular's form API.
 *
 * @template T - The type of the value managed by the form control.
 *
 * @selector [shControlValueAccessor]
 * @standalone true
 * @providers [
 *   {
 *     provide: NG_VALUE_ACCESSOR,
 *     useExisting: forwardRef(() => ShControlValueAccessorDirective),
 *     multi: true,
 *   },
 * ]
 */
@Directive({
  selector: '[shControlValueAccessor]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ShControlValueAccessorDirective),
      multi: true,
    },
  ],
})
/**
 * Directive that acts as a bridge between Angular forms API and a custom input component.
 * Implements the `ControlValueAccessor` interface to integrate with Angular forms.
 *
 * @template T - The type of the value managed by the form control.
 */
export class ShControlValueAccessorDirective<T> implements ControlValueAccessor {
  /**
   * The host component that this directive is applied to.
   */
  public host: ShBaseInputComponent<T, any>;

  /**
   * The Angular form control associated with this directive.
   */
  public ngControl: NgControl;

  /**
   * The Angular model associated with this directive.
   */
  public ngModel: NgModel;

  /**
   * Injector for retrieving Angular services.
   */
  protected injector = inject(Injector);

  ngOnInit() {
    this.ngControl = this.injector.get(NgControl, null);
    this.ngModel = this.injector.get(NgModel, null);
    if (this.ngControl instanceof FormControlName) {
      const formGroupDirective: FormGroupDirective = this.ngControl['_parent'];
      if (formGroupDirective) {
        this.host.formControl = formGroupDirective.form.controls[this.ngControl.name] as ShFormControl<T>;
      }
    }
    if (this.ngControl?.control) {
      this.host.formControl = this.ngControl.control as ShFormControl<T>;
    }
    if (this.host.formControl) {
      this.host.initializeFormControl();
      this.host.enable = this.host.formControl.enabled;

      if (this.ngModel) {
        this.host.formControl.valueChanges
          .pipe(
            filter(value => value !== this.ngModel.model),
            takeUntil(this.host.destroy$!)
          ).subscribe(value => this.ngModel.viewToModelUpdate(value));
      }
    }
  }

  writeValue(value: T): void {
    noop();
  }

  registerOnChange(fn: (value: T) => void): void {
    noop();
  }

  registerOnTouched(fn: () => void): void {
    noop();
  }

  setDisabledState(isDisabled: boolean): void {
    this.host.enable = !isDisabled;
  }
}
