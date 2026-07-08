import { AbstractControl, AsyncValidatorFn, FormArray, ValidatorFn, AbstractControlOptions } from '@angular/forms';

export class ShFormArray<TControl extends AbstractControl<any> = any> extends FormArray<TControl> {

    /**
     * Specifies whether the array instance has been created internally by validation service and should be removed automatically.
     */
    public autodestroy: boolean | undefined = undefined;

    /**
     * Specifies whether the array instance can be destroyed.
     */
    public canDestroy: boolean = true;

    constructor(
        controls: Array<TControl>,
        validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
        asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
    ) {
        super(controls, validatorOrOpts, asyncValidator);
    }

}