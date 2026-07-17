import { IShBaseFormattedOptions, ShBaseFormattedComponent } from '../../../components/base';
import { Component, Injector } from '@angular/core';

@Component({
  templateUrl: './base-formatted.fixture.component.html'
})
export class BaseFormattedFixture extends ShBaseFormattedComponent<any, IShBaseFormattedOptions<any>> {
  protected tolerantCheck(): boolean {
    return true;
  }
  protected parseControlValue() {
    return '';
  }
  protected formatModelValue(): string {
    return '';
  }
  constructor(injector: Injector) {
    super(injector);
  }
}
