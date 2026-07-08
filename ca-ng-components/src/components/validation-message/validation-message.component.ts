import { ShFormControl } from './../../utilities/form-control.utility';
import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import * as _ from 'lodash-es';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';
import { ComplexTypeList } from '../../utilities/complex-type.list';
import { IShBaseOptions, ShBaseModelComponent } from '../base/index';
import { IShMessages } from '../pipes/index';

export interface IShValidatorMessageOptions
  extends IShBaseOptions {
  showValidationMessage?: boolean;
  messages?: IShMessages;
}

@Component({
    selector: 'sh-validation-message',
    templateUrl: './validation-message.component.html',
    styleUrls: ['./validation-message.component.scss'],
    changeDetection: shChangeDetectorStrategy(),
    standalone: false
})
export class ShValidationMessageComponent<T, O extends IShValidatorMessageOptions, TValidationMessage = string>
  extends ShBaseModelComponent<T, O>
  implements OnChanges, OnInit {

  /**
   * The parent object which contains the model
   */
  @Input() public parent?: { [id: string]: any; };

  // Services
  /*protected*/ public complexType: ComplexTypeList;

  // Internals
  /*protected*/ public control: AbstractControl;

  get errors(): TValidationMessage[] {
    return (this.control && this.control.errors ? Object.keys(this.control.errors) : []) as TValidationMessage[];
  }

  get warnings(): TValidationMessage[] {
    return (this.control && (<ShFormControl>this.control).warnings ? Object.keys((<ShFormControl>this.control).warnings) : []) as TValidationMessage[];
  }

  constructor(injector: Injector) {
    super(injector);
    this.complexType = injector.get(ComplexTypeList);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if ((changes['model'] && !this.isChangeEqual(changes['model'])) || (changes['prop'] && !this.isChangeEqual(changes['prop'])) || (changes['parent'] && !this.isChangeEqual(changes['parent']))) {
      //this.formHandler.removeGroup(changes['model'].previousValue);
      delete this.control;
    }
    this.getControl();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getControl();
  }

  /*protected*/ public getControl() {
    if (!this.control) {
      if (this.prop) {
        if (this.parent) {
          // undefined parent[prop] not supported, should throw error?
          this.control = this.formHandler.isFormArrayEnabled && this.parent[this.prop] instanceof Array ? this.formHandler.getArray(this.prop, this.parent) : this.formHandler.getGroup(this.prop, this.parent);
        } else if (this.isComplexType(this.model[this.prop])) {
          this.control = this.formHandler.getGroup(this.model[this.prop], this.model);
        } else {
          this.control = this.formHandler.getControl(this.model, this.prop);
        }
      } else {
        this.control = this.formHandler.isFormArrayEnabled && this.model instanceof Array ? this.formHandler.getArray(this.model) : this.formHandler.getGroup(this.model);
      }
    }
  }

  /*protected*/ public getDefaultOptions(): IShBaseOptions {
    return _.merge(super.getDefaultOptions(), {
      showValidationMessage: true,
      messages: {}
    });
  }

  private isComplexType(value: any) {
    return this.complexType.types.some((t) => value instanceof t);
  }

}
