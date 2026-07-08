import { AbstractControl, AsyncValidatorFn, FormGroup, ValidatorFn, AbstractControlOptions } from '@angular/forms';

export class ShFormGroup<TControl extends { [K in keyof TControl]: AbstractControl<any> } = any> extends FormGroup<TControl> {

    /**
     * Specifies whether the group instance has been created internally by validation service and should be removed automatically.
     */
    public autodestroy: boolean | undefined = undefined;

    /**
     * Specifies whether the group instance can be destroyed.
     */
    public canDestroy: boolean = true;

    constructor(
        controls: TControl,
        validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
        asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
    ) {
        super(controls, validatorOrOpts, asyncValidator);
    }

}