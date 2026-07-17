import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Mstring } from './i18n.model';
import { LocaleService } from './locale.service';

@Injectable({
  providedIn: 'root'
})
export class I18nService {

  constructor(
    private locale: LocaleService,
    private translate: TranslateService
  ) {
    if (!translate.currentLang) {
      translate.setDefaultLang('en');
      locale.getLocale()
        .subscribe(locale => translate.use(locale));
    }
  }

  get(query: string | Mstring, interpolateParams?: Object) {
    if (this.isMstring(query)) {
      return this.translate.get(query.key, interpolateParams)
        .pipe(map(res => res && res !== query.key ? res : query.default));
    } else {
      return of(query);
    }
  }

  private isMstring(value: any): value is Mstring {
    return Boolean(value && value.key);
  }

}
