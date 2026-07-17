import { Component, Injector, Input } from '@angular/core';
import { IShBaseOptions } from './../base/base.component';
import { ShFormComponent } from './../form/form.component';

@Component({
  selector: 'sh-form-group',
  templateUrl: './form-group.component.html'
})
/**
 * Component which applies validations to a group
 * of controls
 */
export class ShFormGroupComponent<T, O extends IShBaseOptions>
  extends ShFormComponent<T, O> {
  /**
   * The object for which binds model
   */
  @Input() public parent: any;

  constructor(injector: Injector) {
    super(injector);
  }

  protected createFormGroup() {
    if (!this.formGroup) {
      this.formGroup = this.formHandler.getGroup(this.model, this.parent);
    }
  }

  protected destroyFormGroup() {
    this.formHandler.removeGroup(this.model, this.parent);
    this.formHandler.removeGroup(this.parent);
  }

}
