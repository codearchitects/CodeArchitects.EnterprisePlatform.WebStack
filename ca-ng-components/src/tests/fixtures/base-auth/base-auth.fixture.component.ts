import { ShBaseAuthComponent, IShBaseOptions } from '../../../components/base';
import { Component, Injector } from '@angular/core';

@Component({
  templateUrl: './base-auth.fixture.component.html'
})
export class BaseAuthFixture extends ShBaseAuthComponent<IShBaseOptions> {
  constructor(injector: Injector) {
    super(injector);
  }
}
