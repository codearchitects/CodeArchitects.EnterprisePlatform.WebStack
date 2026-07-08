import { Injectable, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Mstring } from './i18n.model';
import { LocaleService } from './locale.service';

@Injectable()
export class I18nService implements OnDestroy {

  private _destroy = new Subject<void>();

  constructor(
    private locale: LocaleService,
    private translate: TranslateService
  ) {
    if (!translate.currentLang) {
      //translate.setDefaultLang('en');
      locale.getLocale()
        .pipe(takeUntil(this._destroy))
        .subscribe(locale => translate.use(locale));
    }
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
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
