import { Directive, Injector, SimpleChanges } from '@angular/core';
import { AspectHelper, ContextService } from '@ca-webstack/ng-aspects';
import { Mstring } from '@ca-webstack/ng-i18n';
import * as _ from 'lodash-es';
import { from } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { CaepCoercionType, CaepHook, CaepHookType, CaepOption } from '../../decorators';
import { CaepFormHandlerService } from '../../services/form-handler.service';
import { CaepPipeMapperService } from '../../services/pipe-mapper.service';
import { PickAll, yieldFunc } from '../../utilities/common.utility';
import { CaepFormControl } from '../../utilities/form-control.utility';
import { CaepBaseModelComponent } from './base-model.component';
import { CaepBaseOptions } from './base.component';

export interface ICaepBaseInputOptions<T> extends PickAll<CaepBaseInputOptions<T>> {}

/**
 * Base Input Component options contract
 */
export class CaepBaseInputOptions<T> extends CaepBaseOptions {
  /**
   * Input placeholder. If not specified in options, control tries to
   * assign to it a possible label obtained by value metadata (model[prop])
   */
  @CaepOption({ defaultValue: '' })
  placeholder?: string | Mstring;

  /**
   * Specifies whether input is readonly
   * @default false
   */
  @CaepOption({ defaultValue: false, coercionType: CaepCoercionType.Boolean })
  isReadonly?: any;

  /**
   * Specifies the maximum length (in characters) of input
   */
  @CaepOption({ coercionType: CaepCoercionType.Number })
  maxLength?: number | string;

  /**
   * List of css classes to be applied to input control
   * @default ''
   */
  @CaepOption({ defaultValue: '', coercionType: CaepCoercionType.ArrayToString })
  inputClass?: string | string[];

  /**
   * If specified, the input is flanked by an icon
   */
  icon?: string;

  constructor(options?: ICaepBaseInputOptions<T>) {
    super(options);
  }
}

/**
 * Base Component which introduces the form control
 */
@Directive({
    host: {
        class: 'caep-input-component',
        '[class.caep-input-component-invalid]': 'formControl.invalid',
        '[class.caep-input-component-disabled]': 'formControl.disabled',
        // '[class.caep-input-component-autofilled]': 'formControl.autofilled',
        '[class.caep-input-component-readonly]': 'options.isReadonly',
        '[class.ng-untouched]': '_shouldForward("untouched")',
        '[class.ng-touched]': '_shouldForward("touched")',
        '[class.ng-pristine]': '_shouldForward("pristine")',
        '[class.ng-dirty]': '_shouldForward("dirty")',
        '[class.ng-valid]': '_shouldForward("valid")',
        '[class.ng-invalid]': '_shouldForward("invalid")',
        '[class.ng-pending]': '_shouldForward("pending")'
    },
    standalone: false
})
export abstract class CaepBaseInputComponent<
  T,
  O extends CaepBaseInputOptions<T> = CaepBaseInputOptions<T>
> extends CaepBaseModelComponent<T, O> {
  /**
   * Form Handler Service
   */
  public formHandler: CaepFormHandlerService;

  /**
   * Generated Form Control related to model property value
   */
  public formControl: CaepFormControl;

  /**
   * Event fired when model value changes
   * @param oldValue Form control value
   * @param value Model property value
   */
  public onModelValueChanges: (oldValue: T, value: T) => void;

  /**
   * Pipe mapper service
   */
  protected pipeMapper: CaepPipeMapperService;

  /**
   * Input placeholder. If not specified in options, control tries to
   * assign to it a possible label obtained by value metadata (model[prop])
   */
  //public placeholder: string | Mstring;

  /**
   * Aspect Helper service
   */
  private _aspectHelper: AspectHelper;

  /**
   * Context service
   */
  private _contextService: ContextService;

  /**
   * Base Component which introduces the form control
   */
  constructor(
    injector: Injector,
    optionsCtor: (value?: PickAll<O>) => O = (value?: PickAll<O>) => new CaepBaseInputOptions(value) as O
  ) {
    super(injector, optionsCtor);
    this.formHandler = injector.get(CaepFormHandlerService);
    this.pipeMapper = injector.get(CaepPipeMapperService);
    this._aspectHelper = injector.get(AspectHelper);
    this._contextService = injector.get(ContextService);
  }

  /**
   * Creates a form control related to model property value
   */
  public createFormControl() {
    this.formControl = this.formHandler.getControl(this.model, this.prop, !this.enable);
    if (this.formControl) {
      from(this.formControl.valueChanges)
        .pipe(takeUntil(this.destroy$), distinctUntilChanged())
        .subscribe(this.onControlValueChanges.bind(this));
    }
  }

  /**
   * Removes the form control from the tree
   */
  @CaepHook({ type: CaepHookType.Destroy })
  public destroyFormControl() {
    this.formHandler.removeControl(this.model, this.prop);
  }

  /**
   * Event fired when form control value changes
   */
  public onControlValueChanges() {
    const value = this.getControlValue();
    if (!_.isEqual(this.getModelValue(), value)) {
      this.setModelValue(value);
    }
  }

  /**
   * Handles the model value changes for each change detection cycle
   */
  @CaepHook({ type: CaepHookType.DoCheck })
  public modelValueChangesHandler() {
    const value = this.getModelValue();
    const controlValue = this.getControlValue();
    if (!_.isEqual(controlValue, value)) {
      if (this.onModelValueChanges) {
        this.onModelValueChanges(controlValue, value);
      }
      this.setControlValue(value);
    }
  }

  /**
   * Enables/Disables control according to the action value
   */
  public checkDisabling() {
    if (this.formControl) {
      //mod, called before modelValueChangesHandler
      if (this.enable) {
        if (this.formControl.disabled) {
          yieldFunc(() => this.formControl.enable({ emitEvent: false }));
        }
      } else {
        if (this.formControl.enabled) {
          yieldFunc(() => this.formControl.disable({ emitEvent: false }));
        }
      }
    }
  }

  /**
   * Provides the value of the form control
   */
  public getControlValue() {
    return this.formControl?.value;
  }

  /**
   * Sets the value of the form control
   * @param value New value
   */
  public setControlValue(value: any) {
    this.formControl?.setValue(value);
  }

  /**
   * Marks form control as dirty
   */
  public markAsDirty() {
    if (!this.formControl.dirty) {
      this.formControl.markAsDirty();
    }
  }

  /**
   * Determines whether a class from the formControl should be forwarded to this base input component.
   */
  public _shouldForward(prop: keyof CaepFormControl): boolean {
    const formControl = this.formControl ? this.formControl : null;
    return formControl && formControl[prop];
  }

  /**
   * This method is called when the form field is clicked on.
   */
  public onContainerClick(event: MouseEvent) {
    if (event.target != this.controlRef.nativeElement) {
      this.controlRef.nativeElement!.focus();
    }
  }

  /**
   * Initializes form control and subscribes to enable changes
   */
  @CaepHook({ type: CaepHookType.Init, priority: 1 })
  private initializeFormControl() {
    if (!this.formControl) {
      this.createFormControl();
    }
    this.enableEmitter.pipe(takeUntil(this.destroy$)).subscribe((value: boolean) => this.checkDisabling());
  }

  /**
   * Checks if aspect label is defined when placeholder option is not set
   */
  @CaepHook({ type: CaepHookType.Init })
  private initializePlaceholder() {
    if (!this.options.placeholder) {
      const metaPlaceholder = this._aspectHelper.getLabel(this.model, this.prop, this._contextService.context);
      if (metaPlaceholder) this.options.placeholder = metaPlaceholder;
    }
  }

  /**
   * Updates form control reference on model change
   * @param changes SimpleChanges object containing model change
   */
  @CaepHook({ type: CaepHookType.Change, priority: 1 })
  private onModelChange(changes: SimpleChanges) {
    if (changes['model'] && !this.isChangeEqual(changes['model'])) {
      this.formHandler.removeControl(changes['model'].previousValue, this.prop);
      delete this.formControl;
    }
    if (!this.formControl) {
      this.createFormControl();
    }
  }
}
