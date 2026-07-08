import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isNoU } from '../utilities/common.utility';

@Pipe({
    name: 'hour',
    standalone: false
})
export class ShHourPipe implements PipeTransform {

  constructor(private _translateService: TranslateService) { }

  transform(value: number) {
    const lang = this._translateService.currentLang;
    let format: string;
    switch (lang) {
      case 'it':
        format = 'HH';
        break;
      case 'en':
      default:
        format = 'hh';
        if (value > 12) {
          value -= 12;
        } else if (value === 0) {
          value = 12;
        }
        break;
    }
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
