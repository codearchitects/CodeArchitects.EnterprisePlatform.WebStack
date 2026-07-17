import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isNoU } from '../utilities/common.utility';

@Pipe({
  name: 'year'
})
export class ShYearPipe implements PipeTransform {

  constructor(private _translateService: TranslateService) { }

  transform(value: number) {
    const lang = this._translateService.currentLang;
    let format: string;
    switch (lang) {
      case 'it':
        format = 'AAAA';
        break;
      case 'en':
      default:
        format = 'YYYY';
        break;
    }
    if (!isNoU(value)) {
      if (value < 10) {
        format = `000${value}`;
      } else if (value < 100) {
        format = `00${value}`;
      } else if (value < 1000) {
        format = `0${value}`;
      } else {
        format = `${value}`;
      }
    }
    return format;
  }

}
