import { Pipe, PipeTransform } from '@angular/core';
import { isNoU } from '../utilities/common.utility';

@Pipe({
    name: 'minutes',
    standalone: false
})
export class ShMinutesPipe implements PipeTransform {

  constructor() { }

  transform(value: number) {
    let format = 'mm';
    if (!isNoU(value)) {
      if (value < 10) {
        format = `0${value}`;
      } else {
        format = `${value}`;
      }
    }
    return format;
  }

}
