import { Component, Inject, LOCALE_ID } from '@angular/core';
import { Mstring, LocaleService } from '@ca-webstack/ng-i18n';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = { key: 'HELLO', default: 'Hello' } as Mstring;

  constructor(
    private locale: LocaleService
  ) { }

  changeLang(value: string) {
    this.locale.setLocale(value);
  }

}
