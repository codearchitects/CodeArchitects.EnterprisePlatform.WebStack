import { FormGroup } from '@angular/forms';
import { ShFormGroupComponent } from './../form-group/form-group.component';
import { IShBaseOptions } from './../base/base.component';
import { Component, OnInit, ContentChild, TemplateRef, Injector } from '@angular/core';

@Component({
  selector: 'sh-form-array',
  templateUrl: './form-array.component.html'
})
/**
 * Represents listed templated controls
 */
export class ShFormArrayComponent<T, O extends IShBaseOptions>
  extends ShFormGroupComponent<T, O> {
  /**
   * References to ng-content contents
   */
  @ContentChild(TemplateRef, { static: false })
  template: TemplateRef<FormGroup>;
  /**
   * Represents listed templated controls
   */
  constructor(injector: Injector) {
    super(injector);
  }

}
