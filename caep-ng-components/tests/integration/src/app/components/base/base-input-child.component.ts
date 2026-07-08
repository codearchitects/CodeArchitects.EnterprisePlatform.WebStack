import { Component, Injector } from '@angular/core';
import { CaepBaseInputComponent, CaepBaseInputOptions, CaepOption, PickAll } from '@caep/ng-components';


export interface IBaseInputChildOptions extends PickAll<BaseInputChildOptions> {};

export class BaseInputChildOptions extends CaepBaseInputOptions<string> {

  @CaepOption({ defaultValue: 'text' })
  type?: 'text' | 'password' | 'email';

  constructor(options?: IBaseInputChildOptions) {
    super(options);
  }

}

@Component({
    selector: 'app-base-input-child',
    template: `
    @if (show) {
      <input #controlRef [attr.autofocus]="autofocus || null" [attr.type]="options.type" [class]="options.inputClass"
      [id]="id" [formControl]="formControl" [attr.tabindex]="tabindex" [attr.maxlength]="options.maxLength || null" [attr.readonly]="options.isReadonly || null"
      [placeholder]="options.placeholder" autocomplete="off" [style.minWidth]="width" [style.maxWidth]="width" [style.height]="height">
    }
    `,
    standalone: false
})
export class BaseInputChildComponent extends CaepBaseInputComponent<string, BaseInputChildOptions> {

  constructor(injector: Injector) {
    super(injector, (value?: IBaseInputChildOptions) => new BaseInputChildOptions(value));
  }

}