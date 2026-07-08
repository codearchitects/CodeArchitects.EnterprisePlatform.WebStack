import { IShBaseOptions } from './../base/base.component';
import { ShBaseAuthComponent } from './../base/base-auth.component';
import { Injector, OnChanges, OnInit, OnDestroy, SimpleChanges, Component, Input } from '@angular/core';
import { isNoU } from '../../utilities/common.utility';
import { ShFormGroup } from '../../utilities/form-group.utility';

@Component({
    selector: 'sh-form',
    templateUrl: './form.component.html',
    standalone: false
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
   * The parent object which contains the model
   */
  @Input() public parent?: { [id: string]: T; };
  /**
   * The prop name on the parent object which identifies the model to bind to the form
   */
  @Input() public prop?: string;
  /**
   * Group of form controls
   */
  /*protected*/ public formGroup: ShFormGroup<any>;

  /**
   * Form component which communicates the form validity based on
   * entity's fields binded with form-control components
   */
  constructor(injector: Injector) {
    super(injector);
  }

  public ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['prop'] && !this.isChangeEqual(changes['prop'])) {
      this.formHandler.removeGroup(this.formGroup);
      delete this.formGroup;
    }
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
  /*protected*/ public createFormGroup() {
    if (!this.formGroup) {
      if (isNoU(this.prop)) {
        this.formGroup = this.formHandler.getGroup(this.model);
      } else if (this.parent && this.prop in this.parent) {
        this.formGroup = this.formHandler.getGroup(this.prop, this.parent);
      } else {
        console.warn('Parent or prop is invalid. Unable to create form group.');
      }
    }
  }

  /**
   * Removes the form group from form-handler
   */
  /*protected*/ public destroyFormGroup() {
    if (isNoU(this.prop)) {
      this.formHandler.removeGroup(this.model);
    } else {
      // undefined parent[prop] not supported, should throw error?
      this.formHandler.removeGroup(this.formGroup);
    }
  }

}
