import { Directive, ElementRef } from '@angular/core';
import { yieldFunc } from '../utilities/common.utility';

@Directive({
    selector: '[shDropdown]',
    standalone: false
})
export class ShDropdownDirective {
  constructor(element: ElementRef) {
    yieldFunc(() => {
      const dropdown = $(element.nativeElement),
        dropdownHeight = dropdown.outerHeight();
      const container = dropdown.parents('[shDropdownContainer]')[0];
      if (container) {
        const rect = container.getBoundingClientRect(),
          position = rect.top,
          height = rect.height;
        const overflow = position > dropdownHeight && $(window).height() - position < height + dropdownHeight;
        const hasFixedPosition = dropdown.css('position') === 'fixed';
        if (hasFixedPosition) {
          const offset = 5;
          dropdown.css('margin-top', overflow ? -(dropdownHeight + height - offset) : 'auto');
        } else {
          dropdown.css('bottom', overflow ? height : 'auto');
        }
        dropdown.toggleClass('sh-dropup', overflow);
      }
    });
  }
}
