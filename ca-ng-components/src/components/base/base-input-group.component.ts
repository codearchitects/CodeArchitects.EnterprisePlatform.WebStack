import { Injector, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { ShBaseModelComponent } from './base-model.component';
import { IShBaseOptions } from './base.component';

/**
 * Base Input Group Component options contract
 */
export interface IShBaseInputGroupOptions<T>
  extends IShBaseOptions {
  /**
   * List of css classes to be applied to input control
   * @default []
   */
  inputClass?: string[];
}

/**
 * Base Component which introduces the form group
 */
export abstract class ShBaseInputGroupComponent<T, O extends IShBaseInputGroupOptions<T>>
  extends ShBaseModelComponent<T, O>
  implements OnChanges, OnInit, OnDestroy {
  /**
   * Generated Form Group related to model property values
   */
  protected formGroup: FormGroup;
  /**
   * List of css classes to be applied to control container
   */
  public get inputClass() { return this.internalOptions.inputClass.join(' '); }

  /**
   * Base Component which introduces the form group
   */
  constructor(injector: Injector) {
    super(injector);
  }

  public ngOnInit() {
    super.ngOnInit();
    if (!this.formGroup) {
      this.createFormGroup();
    }
  }

  public ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['model'] && !changes['model'].isFirstChange() && !this.isChangeEqual(changes['model'])) {
      this.formHandler.removeGroup(changes['model'].previousValue[this.prop], changes['model'].previousValue);
      delete this.formGroup;
    }
    if (!this.formGroup) {
      this.createFormGroup();
    }
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
    this.destroyFormGroup();
  }

  /**
   * Creates a form group related to model property values
   */
  protected createFormGroup() {
    this.formGroup = this.formHandler.getGroup(this.getModelValue(), this.model);
  }

  /**
   * Removes the form group from the tree
   */
  protected destroyFormGroup() {
    this.formHandler.removeGroup(this.getModelValue(), this.model);
  }

  protected getDefaultOptions(): IShBaseInputGroupOptions<T> {
    return _.merge(super.getDefaultOptions(), {
      inputClass: [],
      onChange: (value: T) => undefined
    });
  }

}
