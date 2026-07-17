import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  private locale$: BehaviorSubject<string>;

  constructor(
    @Inject(LOCALE_ID) locale: string
  ) {
    this.locale$ = new BehaviorSubject<string>(locale.substr(0, 2));
  }

  getLocale(): Observable<string> {
    return this.locale$.asObservable();
  }

  setLocale(locale: string) {
    this.locale$.next(locale);
  }

}
