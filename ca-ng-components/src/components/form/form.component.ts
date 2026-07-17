import { Component, Injector, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ShBaseAuthComponent } from './../base/base-auth.component';
import { IShBaseOptions } from './../base/base.component';

@Component({
  selector: 'sh-form',
  templateUrl: './form.component.html'
})
/**
 * Form component which communicates the form validity based on
 * entity's fields binded with form-control components
 */
export class ShFormComponent<T, O extends IShBaseOptions>
  extends ShBaseAuthComponent<O>
  implements OnChanges, OnInit, OnDestroy {
  /**
   * The binding
   */
  @Input() public model: T;
  /**
   * Group of form controls
   */
  public formGroup: FormGroup;

  /**
   * Form component which communicates the form validity based on
   * entity's fields binded with form-control components
   */
  constructor(injector: Injector) {
    super(injector);
  }

  public ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['model'] && !this.isChangeEqual(changes['model'])) {
      this.formHandler.removeGroup(changes['model'].previousValue);
      delete this.formGroup;
    }
    this.createFormGroup();
  }

  public ngOnInit() {
    super.ngOnInit();
    this.createFormGroup();
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
    this.destroyFormGroup();
  }

  /**
   * Initializes and attaches to form-handler the form group
   */
  protected createFormGroup() {
    if (!this.formGroup) {
      this.formGroup = this.formHandler.getGroup(this.model);
    }
  }

  /**
   * Removes the form group from form-handler
   */
  protected destroyFormGroup() {
    this.formHandler.removeGroup(this.model);
  }

}
