import { Pipe, PipeTransform } from '@angular/core';
import { I18nService, Mstring, I18nPipe } from '@ca-webstack/ng-i18n';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

/**
 * Pipe which apply translation using i18n service or translate service
 * based on value type (string or mstring).
 * The pipe must be used with async pipe (value | interpret | async)
 */
@Pipe({
  name: 'interpret'
})
export class ShInterpretPipe implements PipeTransform {

  constructor(private _i18nService: I18nService, private _translateService: TranslateService) { }

  public async transform(value: string | Mstring) {
    let translation: string;
    if (value) {
      if ((value as Mstring).key) {
        translation = await this._i18nService.get(value as Mstring).toPromise();
      } else {
        translation = await this._translateService.get(value as string).toPromise();
      }
    }
    return translation;
  }

}
