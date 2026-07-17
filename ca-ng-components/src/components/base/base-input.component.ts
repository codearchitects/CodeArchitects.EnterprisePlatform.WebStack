import { DoCheck, Injector, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AspectHelper, ContextService } from '@ca-webstack/ng-aspects';
import { Mstring } from '@ca-webstack/ng-i18n';
import * as _ from 'lodash';
import { from } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ShFormControl } from '../../utilities/form-control.utility';
import { ShBaseModelComponent } from './base-model.component';
import { IShBaseOptions } from './base.component';

/**
 * Base Input Component options contract
 */
export interface IShBaseInputOptions<T> extends IShBaseOptions {
  /**
   * Input placeholder
   */
  placeholder?: string | Mstring;
  /**
   * Specifies whether input is readonly
   * @default false
   */
  isReadonly?: boolean;
  /**
   * Specifies the maximum length (in characters) of input
   */
  maxLength?: number;
  /**
   * List of css classes to be applied to input control
   * @default []
   */
  inputClass?: string[];
}

/**
 * Base Component which introduces the form control
 */
export abstract class ShBaseInputComponent<T, O extends IShBaseInputOptions<T>>
  extends ShBaseModelComponent<T, O>
  implements OnChanges, OnInit, DoCheck, OnDestroy {
  /**
   * If specified, the input is flanked by an icon
   */
  @Input() public icon: string;
  /**
   * List of css classes to be applied to control container
   */
  public get inputClass() { return this.internalOptions.inputClass.join(' '); }
  /**
   * Specifies whether input is readonly
   */
  public get isReadonly() {
    return this.internalOptions.isReadonly;
  }
  public set isReadonly(value: boolean) {
    this.internalOptions.isReadonly = value;
  }
  /**
   * Generated Form Control related to model property value
   */
  public formControl: ShFormControl;
  /**
   * Event fired when model value changes
   * @param oldValue Form control value
   * @param value Model property value
   */
  protected onModelValueChanges: (oldValue: T, value: T) => void;
  /**
   * Input placeholder. If not specified in options, control tries to
   * assign to it a possible label obtained by value metadata (model[prop])
   */
  protected placeholder: string | Mstring;
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
  constructor(injector: Injector) {
    super(injector);
    this._aspectHelper = injector.get(AspectHelper);
    this._contextService = injector.get(ContextService);
  }

  public ngOnInit() {
    super.ngOnInit();
    if (!this.formControl) {
      this.createFormControl();
    }
    this.placeholder = this.internalOptions.placeholder || this._aspectHelper.getLabel(this.model, this.prop, this._contextService.context);
  }

  public ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['model'] && !this.isChangeEqual(changes['model'])) {
      this.formHandler.removeControl(changes['model'].previousValue, this.prop);
      delete this.formControl;
    }
    if (!this.formControl) {
      this.createFormControl();
    }
  }

  public ngDoCheck() {
    this.modelValueChangesHandler();
    this.checkDisabling();
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
    this.destroyFormControl();
  }

  /**
   * Creates a form control related to model property value
   */
  protected createFormControl() {
    this.formControl = this.formHandler.getControl(this.model, this.prop);
    if (this.formControl) {
      from(this.formControl.valueChanges)
        .pipe(takeUntil(this.destroy$), distinctUntilChanged())
        .subscribe(this.onControlValueChanges.bind(this));
    }
  }

  /**
   * Removes the form control from the tree
   */
  protected destroyFormControl() {
    this.formHandler.removeControl(this.model, this.prop);
  }

  protected getDefaultOptions(): IShBaseInputOptions<T> {
    return _.merge(super.getDefaultOptions(), {
      placeholder: '',
      inputClass: [],
      onChange: (value: T) => undefined
    });
  }

  /**
   * Event fired when form control value changes
   */
  protected onControlValueChanges() {
    const value = this.getControlValue();
    if (!_.isEqual(this.getModelValue(), value)) {
      this.setModelValue(value);
    }
  }

  /**
   * Handles the model value changes for each change detection cycle
   */
  protected modelValueChangesHandler() {
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
  protected checkDisabling() {
    if (this.formControl) {
      if (this.enable) {
        if (this.formControl.disabled) {
          this.formControl.enable();
        }
      } else {
        if (this.formControl.enabled) {
          this.formControl.disable();
        }
      }
    }
  }

  /**
   * Provides the value of the form control
   */
  protected getControlValue() {
    if (this.formControl) {
      return this.formControl.value;
    }
  }

  /**
   * Sets the value of the form control
   * @param value New value
   */
  protected setControlValue(value: any) {
    if (this.formControl) {
      this.formControl.setValue(value);
    }
  }

  /**
   * Marks form control as dirty
   */
  protected markAsDirty() {
    if (!this.formControl.dirty) {
      this.formControl.markAsDirty();
    }
  }

}
