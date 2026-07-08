import { AbstractControl, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { Mstring } from '@ca-webstack/ng-i18n';

export interface IShBaseValidationParams {
    /**
     * Validation rule (synchronous or asynchronous)
     */
    validator: ValidatorFn | AsyncValidatorFn;
    /**
     * Specifies if the validation rule is asynchronous
     */
    async?: boolean;
    /**
     * Validation message (simple string or Mstring object which specifies translation key and default value)
     */
    message: string | Mstring;
    /**
     * Name of the validation rule
     */
    name?: string;
    /**
     * Specifies if the validation rule should be applied only if the condition is met
     */
    condition?: (control: AbstractControl) => boolean;
}