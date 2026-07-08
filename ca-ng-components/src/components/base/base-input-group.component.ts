import { Injector, OnChanges, OnInit, OnDestroy, SimpleChanges, Output, EventEmitter, Directive } from '@angular/core';
import * as _ from 'lodash-es';
import { IShBaseOptions } from './base.component';
import { ShBaseModelComponent } from './base-model.component';
import { ShFormGroup } from '../../utilities/form-group.utility';

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
@Directive()
export abstract class ShBaseInputGroupComponent<T, O extends IShBaseInputGroupOptions<T>>
  extends ShBaseModelComponent<T, O>
  implements OnChanges, OnInit, OnDestroy {
  /**
   * Generated Form Group related to model property values
   */
  /*protected*/ public formGroup: ShFormGroup<any>;
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
  /*protected*/ public createFormGroup() {
    this.formGroup = this.formHandler.getGroup(this.getModelValue(), this.model);
  }

  /**
   * Removes the form group from the tree
   */
  /*protected*/ public destroyFormGroup() {
    this.formHandler.removeGroup(this.getModelValue(), this.model);
  }

  /*protected*/ public getDefaultOptions(): IShBaseInputGroupOptions<T> {
    return _.merge(super.getDefaultOptions(), {
      inputClass: [],
      onChange: (value: T) => undefined
    });
  }

}
