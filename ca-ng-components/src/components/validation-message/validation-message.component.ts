import { Component, Injector, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import * as _ from 'lodash';
import { SH_CHANGE_DETECTOR } from 'src/environments/change-detection-strategy';
import { ComplexTypeList } from '../../utilities/complex-type.list';
import { IShBaseOptions, ShBaseModelComponent } from '../base/index';
import { IShMessages } from '../pipes/index';
import { ShFormControl } from './../../utilities/form-control.utility';

export interface IShValidatorMessageOptions
  extends IShBaseOptions {
  showValidationMessage?: boolean;
  messages?: IShMessages;
}

@Component({
  selector: 'sh-validation-message',
  templateUrl: './validation-message.component.html',
  styleUrls: ['./validation-message.component.scss'],
  changeDetection: SH_CHANGE_DETECTOR.STRATEGY
})
export class ShValidationMessageComponent<T, O extends IShValidatorMessageOptions>
  extends ShBaseModelComponent<T, O>
  implements OnChanges, OnInit {

  // Services
  protected complexType: ComplexTypeList;

  // Internals
  public control: AbstractControl;

  get errors() {
    return this.control && this.control.errors ? Object.keys(this.control.errors) : [];
  }

  get warnings() {
    return this.control && (<ShFormControl>this.control).warnings ? Object.keys((<ShFormControl>this.control).warnings) : [];
  }

  constructor(injector: Injector) {
    super(injector);
    this.complexType = injector.get(ComplexTypeList);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['model'] && !this.isChangeEqual(changes['model'])) {
      this.formHandler.removeGroup(changes['model'].previousValue);
      delete this.control;
    }
    this.getControl();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getControl();
  }

  protected getControl() {
    if (!this.control) {
      if (this.prop) {
        if (this.isComplexType(this.model[this.prop])) {
          this.control = this.formHandler.getGroup(this.model[this.prop], this.model);
        } else {
          this.control = this.formHandler.getControl(this.model, this.prop);
        }
      } else {
        this.control = this.formHandler.getGroup(this.model);
      }
    }
  }

  protected getDefaultOptions(): IShBaseOptions {
    return _.merge(super.getDefaultOptions(), {
      showValidationMessage: true,
      messages: {}
    });
  }

  private isComplexType(value: any) {
    return this.complexType.types.some((t) => value instanceof t);
  }

}
