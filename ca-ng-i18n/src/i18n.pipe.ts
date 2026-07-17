import { Pipe, PipeTransform } from '@angular/core';

import { Mstring } from './i18n.model';
import { I18nService } from './i18n.service';

@Pipe({
  name: 'i18n',
  pure: false
})
export class I18nPipe implements PipeTransform {

  result: string;

  constructor(
    private i18n: I18nService
  ) { }

  transform(query: string | Mstring, interpolateParams?: Object) {
    this.i18n.get(query, interpolateParams)
      .subscribe(res => this.result = res);
    return this.result;
  }

}
