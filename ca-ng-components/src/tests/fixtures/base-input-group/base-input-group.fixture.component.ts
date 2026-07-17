import { IShBaseInputGroupOptions, ShBaseInputGroupComponent } from '../../../components/base';
import { Component, Injector } from '@angular/core';

@Component({
  templateUrl: './base-input-group.fixture.component.html'
})
export class BaseInputGroupFixture extends ShBaseInputGroupComponent<any, IShBaseInputGroupOptions<any>> {
  constructor(injector: Injector) {
    super(injector);
  }
}
