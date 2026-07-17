import { IShBaseOptions, ShBaseModelComponent } from './../../../components/base';
import { Component, Injector } from '@angular/core';

@Component({
  templateUrl: './base-model.fixture.component.html'
})
export class BaseModelFixture extends ShBaseModelComponent<any, IShBaseOptions> {
  constructor(injector: Injector) {
    super(injector);
  }
}
