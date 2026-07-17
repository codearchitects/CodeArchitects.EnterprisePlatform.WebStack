import { Component, Injector } from '@angular/core';
import { IShSelectOptions, ShSelectComponent } from '../../select/select.component';

@Component({
  selector: 'sh-popover-country-select',
  templateUrl: './popover-country-select.component.html',
  styleUrls: ['./popover-country-select.component.scss'],
})
export class ShPopoverCountrySelect<T, V, O extends IShSelectOptions<T, V>> extends ShSelectComponent<T, V, O> {
  constructor(injector: Injector) {
    super(injector);
  }
}
