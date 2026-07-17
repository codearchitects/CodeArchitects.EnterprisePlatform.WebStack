import { IShBaseOptions, ShBaseComponent } from './../../../components/base/base.component';
import { Component, Injector } from '@angular/core';

@Component({
  templateUrl: './base.fixture.component.html'
})
export class BaseFixture extends ShBaseComponent<IShBaseOptions> {
  constructor(injector: Injector) {
    super(injector);
  }
}
