import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isNoU } from '../utilities/common.utility';

@Pipe({
  name: 'day'
})
export class ShDayPipe implements PipeTransform {

  constructor(private _translateService: TranslateService) { }

  transform(value: number) {
    const lang = this._translateService.currentLang;
    let format: string;
    switch (lang) {
      case 'it':
        format = 'GG';
        break;
      case 'en':
      default:
        format = 'DD';
        break;
    }
    if (!isNoU(value)) {
      if (value === 0) { // 0 pressed
        return '0';
      } else if (value < 10) {
        format = `0${value}`;
      } else {
        format = `${value}`;
      }
    }
    return format;
  }

}
