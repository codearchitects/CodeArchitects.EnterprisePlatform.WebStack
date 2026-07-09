import { Optional, Pipe, PipeTransform } from '@angular/core';
import { I18nService, Mstring } from '@ca-webstack/ng-i18n';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Pipe({
    name: 'translateMstring',
    standalone: false
})
export class CaepTranslateMstringPipe implements PipeTransform {

  constructor(@Optional() private translate: TranslateService, private i18n: I18nService) { }

  transform(object: string | Mstring, interpolateParams?: Object): Observable<any> {
    if (object) {
      if (typeof object === 'string') {
        return this.translate?.get(object, interpolateParams); 
      } else {
        return this.i18n.get(object, interpolateParams)
      }
    }
  }

}
 