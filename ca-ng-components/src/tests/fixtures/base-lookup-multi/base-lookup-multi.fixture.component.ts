import { IShBaseLookupMultiOptions, ShBaseLookupMultiComponent } from '../../../components/base';
import { Component, Injector } from '@angular/core';

@Component({
  templateUrl: './base-lookup-multi.fixture.component.html'
})
export class BaseLookupMultiFixture extends ShBaseLookupMultiComponent<any, any, IShBaseLookupMultiOptions<any, any>> {
  constructor(injector: Injector) {
    super(injector);
  }
}
