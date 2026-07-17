import { IShBaseLookupSingleOptions, ShBaseLookupSingleComponent } from '../../../components/base';
import { Component, Injector } from '@angular/core';

@Component({
  templateUrl: './base-lookup-single.fixture.component.html'
})
export class BaseLookupSingleFixture extends ShBaseLookupSingleComponent<any, any, IShBaseLookupSingleOptions<any, any>> {
  constructor(injector: Injector) {
    super(injector);
  }
}
