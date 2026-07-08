import { Pipe, PipeTransform } from '@angular/core';
import { isNoU } from '../utilities/common.utility';

@Pipe({
    name: 'month',
    standalone: false
})
export class ShMonthPipe implements PipeTransform {
  transform(value: number) {
    let retval = `MM`;
    if (!isNoU(value)) {
      value = value + 1;
      if (value === 0) { // -1 is zero pressed
        retval = '0';
      } else if (value < 10) {
        retval = `0${value}`;
      } else {
        retval = `${value}`;
      }
    }
    return retval;
  }
}
