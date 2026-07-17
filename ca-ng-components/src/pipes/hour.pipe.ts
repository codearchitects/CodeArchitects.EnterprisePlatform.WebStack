import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isNoU } from 'src/utilities';
import { ShHourKey } from './../components/date/date.component';

@Pipe({
  name: 'hour'
})
export class ShHourPipe implements PipeTransform {

  constructor(private _translateService: TranslateService) { }

  transform(value: number, format?: ShHourKey) {
    const lang = this._translateService.currentLang;
    let formattedValue: string;
    if (isNoU(format)) {
      switch (lang) {
        case 'it':
          format = 'HH';
          break;
        case 'en':
        default:
          format = 'hh';
          break;
      }
    }

    if (format === 'hh') {
      if (value > 12) {
        value -= 12;
      } else if (value === 0) {
        value = 12;
      }
    }

    if (!isNoU(value)) {
      if (value < 10) {
        formattedValue = `0${value}`;
      } else {
        formattedValue = `${value}`;
      }
    }
    return formattedValue;
  }

}
