import { Component, Injector } from '@angular/core';
import { CaepBaseOptions, PickAll, CaepBaseComponent, CaepOption } from '@ca-webstack/ng-components-extra';

export interface IBaseChildOptions extends PickAll<BaseChildOptions> {};
export class BaseChildOptions extends CaepBaseOptions {

  @CaepOption({ defaultValue: 'button' })
  type?: 'button' | 'reset' | 'submit';

  constructor(options?: IBaseChildOptions) {
    super(options);
  }

}

@Component({
    selector: 'app-base-child',
    template: `
    <button #controlRef [attr.type]="options.type" [attr.tabindex]="tabindex"
    [id]="id" [class]="containerClass"
    [attr.autofocus]="autofocus || null" [ngStyle]="{ 'width': width, 'height': height }">Width: {{ width }} - Height: {{ height }}</button>
    `,
    standalone: false
})
export class BaseChildComponent extends CaepBaseComponent<BaseChildOptions> {

  constructor(injector: Injector) {
    super(injector, (value?: IBaseChildOptions) => new BaseChildOptions(value));
  }

}
