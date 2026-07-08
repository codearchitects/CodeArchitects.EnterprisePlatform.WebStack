import { ShFormComponent } from './../form/form.component';
import { IShBaseOptions } from './../base/base.component';
import { Component, Injector } from '@angular/core';
import { isNoU } from '../../utilities/common.utility';

@Component({
    selector: 'sh-form-group',
    templateUrl: './form-group.component.html',
    standalone: false
})
/**
 * Component which applies validations to a group
 * of controls
 */
export class ShFormGroupComponent<T, O extends IShBaseOptions>
  extends ShFormComponent<T, O> {

  constructor(injector: Injector) {
    super(injector);
  }

  /*protected*/ public createFormGroup() {
    if (!this.formGroup) {
      if (isNoU(this.prop)) {
        this.formGroup = this.formHandler.getGroup(this.model, this.parent);
      } else if (this.parent && this.prop in this.parent) {
        this.formGroup = this.formHandler.getGroup(this.prop, this.parent);
      } else {
        console.warn('Parent or prop is invalid. Unable to create form group.');
      }
    }
  }

  /*protected*/ public destroyFormGroup() {
    if (isNoU(this.prop)) {
      this.formHandler.removeGroup(this.model, this.parent);
    } else {
      // undefined parent[prop] not supported, should throw error?
      this.formHandler.removeGroup(this.formGroup);
    }
  }

}
