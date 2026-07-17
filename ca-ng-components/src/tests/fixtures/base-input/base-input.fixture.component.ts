import { IShBaseInputOptions, ShBaseInputComponent } from './../../../components/base';
import { Component, Injector } from '@angular/core';

@Component({
  templateUrl: './base-input.fixture.component.html'
})
export class BaseInputFixture extends ShBaseInputComponent<any, IShBaseInputOptions<any>> {
  constructor(injector: Injector) {
    super(injector);
  }
}
